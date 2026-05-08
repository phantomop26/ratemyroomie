import { randomInt } from 'crypto';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isNyuEmail } from '@/lib/auth';

async function sendEmail(to: string, subject: string, text: string) {
  // Prefer a configured SMTP provider using environment variables, otherwise
  // log the code server-side for development.
  const smtpUrl = process.env.SMTP_URL;
  if (!smtpUrl) {
    console.log(`DEV EMAIL to=${to} subject=${subject} text=${text}`);
    return;
  }

  // Minimal nodemailer usage if SMTP_URL present
  const nodemailer = await import('nodemailer');
  const transporter = nodemailer.createTransport(smtpUrl);
  await transporter.sendMail({ from: process.env.EMAIL_FROM || 'no-reply@ratemyroommate.nyu', to, subject, text });
}

export async function POST(request: Request) {
  const form = await request.formData();
  const email = String(form.get('email') || '').trim().toLowerCase();
  const displayName = String(form.get('displayName') || '').trim() || null;
  const dorm = String(form.get('dorm') || '').trim() || null;

  // Allow testing with non-NYU emails when ALLOW_ANY_EMAIL=true (dev only)
  if (!isNyuEmail(email) && process.env.ALLOW_ANY_EMAIL !== 'true') {
    return NextResponse.redirect(new URL('/join?error=nyu-email', request.url), 303);
  }

  // Upsert user record so we can link later
  const user = await prisma.user.upsert({
    where: { email },
    create: { email, displayName, nyuVerified: false },
    update: { displayName: displayName ?? undefined },
  });

  // create a 6-digit code
  const code = String(randomInt(100000, 999999));
  const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

  await prisma.verificationToken.create({ data: { email, token: code, expiresAt } });

  // send or log email
  const subject = 'Your Rate My Roommate verification code';
  const text = `Your verification code is: ${code}. It expires in 15 minutes.`;
  try {
    await sendEmail(email, subject, text);
  } catch (err) {
    console.error('sendEmail error', err);
    // Redirect back to join with an SMTP error indicator so the UI can show a helpful message.
    const redirectErr = new URL('/join', request.url);
    redirectErr.searchParams.set('error', 'smtp');
    // In non-production include a short sanitized error message for debugging only
    if (process.env.NODE_ENV !== 'production') {
      const msg = err && (err as any).response ? String((err as any).response) : String(err);
      redirectErr.searchParams.set('smtpMessage', msg.substring(0, 200));
    }
    return NextResponse.redirect(redirectErr, 303);
  }

  // redirect to verify page; in dev include code as query param to make testing easier
  const redirectUrl = new URL('/verify', request.url);
  redirectUrl.searchParams.set('email', email);
  if (process.env.NODE_ENV !== 'production') redirectUrl.searchParams.set('devCode', code);

  return NextResponse.redirect(redirectUrl, 303);
}
