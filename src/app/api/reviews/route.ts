import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const user = await getSessionUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const profileId = String(formData.get('profileId') || '').trim();
  const comment = String(formData.get('comment') || '').trim();
  const cleanliness = Number(formData.get('cleanliness') || 0);
  const communication = Number(formData.get('communication') || 0);
  const sleep = Number(formData.get('sleep') || 0);

  if (!profileId || !comment) {
    return NextResponse.redirect(new URL('/?error=review', request.url), 303);
  }

  const vibeScore = Math.max(1, Math.min(5, Math.round((cleanliness + communication + sleep) / 3)));

  await prisma.$transaction(async (tx) => {
    await tx.review.create({
      data: {
        profileId,
        authorId: user.id,
        cleanliness,
        communication,
        sleep,
        vibeScore,
        comment,
      },
    });

    const aggregate = await tx.review.aggregate({
      where: { profileId },
      _avg: { vibeScore: true },
      _count: { vibeScore: true },
    });

    await tx.roommateProfile.update({
      where: { id: profileId },
      data: {
        averageRating: aggregate._avg.vibeScore ?? 0,
        reviewCount: aggregate._count.vibeScore,
      },
    });
  });

  return NextResponse.redirect(new URL('/?saved=review', request.url), 303);
}