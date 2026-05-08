import { prisma } from '@/lib/db';
import { getHalls } from '@/lib/halls';

export const getHomepageData = async () => {
  const [profiles, reviews] = await Promise.all([
    prisma.roommateProfile.findMany({
      orderBy: [{ averageRating: 'desc' }, { reviewCount: 'desc' }, { createdAt: 'desc' }],
      take: 12,
      include: {
        user: {
          select: { email: true, displayName: true },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 3,
          include: {
            author: {
              select: { email: true, displayName: true },
            },
          },
        },
      },
    }),
    prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: {
        profile: {
          select: { fullName: true, dorm: true, vibe: true },
        },
        author: {
          select: { email: true, displayName: true },
        },
      },
    }),
  ]);

  const halls = await getHalls();

  return { profiles, reviews, halls };
};