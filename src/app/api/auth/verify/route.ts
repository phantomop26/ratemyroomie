import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { SESSION_COOKIE } from '@/lib/auth';

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get('email') || '').trim().toLowerCase();
  const code = String(form.get('code') || '').trim();
  const redirectTo = String(form.get('redirectTo') || '/dashboard');

  const record = await prisma.verificationToken.findFirst({ where: { email, token: code, used: false } });
  if (!record || record.expiresAt <= new Date()) {
    return NextResponse.redirect(new URL(`/verify?email=${encodeURIComponent(email)}&error=invalid`, request.url), 303);
  }

  await prisma.verificationToken.update({ where: { id: record.id }, data: { used: true } });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.redirect(new URL('/join?error=no-user', request.url), 303);
  }

  // mark verified
  await prisma.user.update({ where: { id: user.id }, data: { nyuVerified: true } });

  const token = randomUUID();
  await prisma.session.create({ data: { token, userId: user.id, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) } });

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
