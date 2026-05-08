import { cookies } from 'next/headers';
import { cache } from 'react';
import { prisma } from '@/lib/db';

export const SESSION_COOKIE = 'rmm_session';

export const isNyuEmail = (email: string) => /^[a-z0-9._%+-]+@(?:[a-z0-9-]+\.)?nyu\.edu$/i.test(email.trim());

export const getSessionUser = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt <= new Date()) {
    return null;
  }

  return session.user;
});