import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { isNyuEmail, SESSION_COOKIE } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const displayName = String(formData.get('displayName') || '').trim() || null;
  const redirectTo = String(formData.get('redirectTo') || '/dashboard');

  if (!isNyuEmail(email)) {
    return NextResponse.redirect(new URL('/join?error=nyu-email', request.url), 303);
  }

  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      displayName,
      nyuVerified: true,
    },
    update: {
      displayName: displayName ?? undefined,
      nyuVerified: true,
    },
  });

  const token = randomUUID();
  await prisma.session.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    },
  });

  const response = NextResponse.redirect(new URL(redirectTo, request.url), 303);
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}