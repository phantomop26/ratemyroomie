import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get('id');

  try {
    if (profileId) {
      // Get single profile with all reviews
      const profile = await prisma.roommateProfile.findUnique({
        where: { id: profileId },
        include: {
          reviews: {
            include: { author: { select: { displayName: true, email: true } } },
            orderBy: { createdAt: 'desc' },
          },
          user: { select: { displayName: true, email: true } },
        },
      });

      if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }

      return NextResponse.json(profile);
    } else {
      // Get all profiles for browse
      const profiles = await prisma.roommateProfile.findMany({
        select: {
          id: true,
          fullName: true,
          dorm: true,
          vibe: true,
          bio: true,
          averageRating: true,
          reviewCount: true,
          tags: true,
        },
        orderBy: [{ averageRating: 'desc' }, { reviewCount: 'desc' }],
      });

      return NextResponse.json(profiles);
    }
  } catch (error) {
    console.error('Profiles API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || '';

  // Handle JSON requests from post-review page (creating profiles for others)
  if (contentType.includes('application/json')) {
    try {
      const data = await request.json();
      const { fullName, dorm, vibe, bio, sleepSchedule } = data;

      if (!fullName || !dorm) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const profile = await prisma.roommateProfile.create({
        data: {
          fullName,
          dorm,
          vibe: vibe || 'Unknown',
          sleepSchedule: sleepSchedule || 'Unknown',
          bio: bio || null,
          tags: [],
          cleanliness: 0,
          communication: 0,
          socialLevel: 0,
        },
      });

      return NextResponse.json(profile);
    } catch (error) {
      console.error('Profile creation error:', error);
      return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
    }
  }

  // Handle FormData requests from dashboard (updating user's own profile)
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const fullName = String(formData.get('fullName') || '').trim();
  const dorm = String(formData.get('dorm') || '').trim();
  const vibe = String(formData.get('vibe') || '').trim();
  const sleepSchedule = String(formData.get('sleepSchedule') || '').trim();
  const bio = String(formData.get('bio') || '').trim() || null;
  const tags = String(formData.get('tags') || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 8);
  const cleanliness = Number(formData.get('cleanliness') || 0);
  const communication = Number(formData.get('communication') || 0);
  const socialLevel = Number(formData.get('socialLevel') || 0);

  if (!fullName || !dorm || !vibe || !sleepSchedule) {
    return NextResponse.redirect(new URL('/?error=profile', request.url), 303);
  }

  await prisma.roommateProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      fullName,
      dorm,
      vibe,
      sleepSchedule,
      cleanliness,
      communication,
      socialLevel,
      bio,
      tags,
    },
    update: {
      fullName,
      dorm,
      vibe,
      sleepSchedule,
      cleanliness,
      communication,
      socialLevel,
      bio,
      tags,
    },
  });

  return NextResponse.redirect(new URL('/dashboard?saved=profile', request.url), 303);
}