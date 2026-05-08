const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const halls = [
  { name: 'Brittany Hall', style: 'Traditional', group: 'First-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Founders Hall', style: 'Traditional', group: 'First-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Lipton Hall', style: 'Traditional', group: 'First-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Othmer Hall', style: 'Traditional', group: 'All Undergraduates', neighborhood: 'Brooklyn', notes: '' },
  { name: 'Palladium Hall', style: 'Traditional', group: 'First-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Rubin Hall', style: 'Traditional', group: 'First-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Weinstein Hall', style: 'Traditional', group: 'First-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Alumni Hall', style: 'Apartment', group: 'Upper-Year & Grad', neighborhood: 'Manhattan', notes: '' },
  { name: 'Broome Street Residential College', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Carlyle Court', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'St George Clark Hall', style: 'Apartment', group: 'All Undergraduates', neighborhood: 'Brooklyn', notes: '' },
  { name: 'Coral Tower', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Gramercy Green', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Greenwich Hotel', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Lafayette Hall', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Second Street', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Green House at 7th Street', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: '6th Street', style: 'Apartment', group: 'Upper-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'Third Avenue North', style: 'Apartment', group: 'All Undergraduates', neighborhood: 'Manhattan', notes: '' },
  { name: 'University Hall', style: 'Apartment', group: 'First-Year Students', neighborhood: 'Manhattan', notes: '' },
  { name: 'WSV & Stuy Town', style: 'Grad', group: 'Graduate Students', neighborhood: 'Manhattan', notes: '' },
];

const TEST_USERS = [
  {
    email: 'alice@nyu.edu',
    displayName: 'Alice',
    profile: {
      fullName: 'Alice Chen',
      dorm: 'Rubin Hall',
      vibe: 'Night Owl',
      sleepSchedule: 'Sleeps 1-7am',
      bio: 'Senior living in Rubin. Love gaming and late-night study sessions!',
      tags: ['gamer', 'quiet', 'clean'],
      cleanliness: 4,
      communication: 5,
      socialLevel: 3,
    },
  },
  {
    email: 'bob@nyu.edu',
    displayName: 'Bob',
    profile: {
      fullName: 'Bob Rodriguez',
      dorm: 'Weinstein Hall',
      vibe: 'Social Butterfly',
      sleepSchedule: 'Sleeps 11pm-7am',
      bio: 'Junior who loves hosting study groups. Always down to grab food!',
      tags: ['social', 'friendly', 'music-lover'],
      cleanliness: 3,
      communication: 5,
      socialLevel: 5,
    },
  },
  {
    email: 'carol@nyu.edu',
    displayName: 'Carol',
    profile: {
      fullName: 'Carol Kim',
      dorm: 'Third Avenue North',
      vibe: 'Study Focused',
      sleepSchedule: 'Sleeps 10pm-6am',
      bio: 'Pre-med junior. Quiet, organized, and respectful of shared spaces.',
      tags: ['quiet', 'organized', 'respectful'],
      cleanliness: 5,
      communication: 4,
      socialLevel: 2,
    },
  },
  {
    email: 'david@nyu.edu',
    displayName: 'David',
    profile: {
      fullName: 'David Smith',
      dorm: 'Alumni Hall',
      vibe: 'Chill',
      sleepSchedule: 'Sleeps 11pm-8am',
      bio: 'Sophomore. Laid-back, love movies and board games.',
      tags: ['chill', 'easygoing', 'gamer'],
      cleanliness: 3,
      communication: 4,
      socialLevel: 4,
    },
  },
  {
    email: 'emma@nyu.edu',
    displayName: 'Emma',
    profile: {
      fullName: 'Emma Johnson',
      dorm: 'Palladium Hall',
      vibe: 'Party',
      sleepSchedule: 'Sleeps 2am-9am',
      bio: 'Freshman. Love going out and meeting new people!',
      tags: ['outgoing', 'social', 'night-life'],
      cleanliness: 2,
      communication: 4,
      socialLevel: 5,
    },
  },
  {
    email: 'frank@nyu.edu',
    displayName: 'Frank',
    profile: {
      fullName: 'Frank Lee',
      dorm: 'Brittany Hall',
      vibe: 'Early Bird',
      sleepSchedule: 'Sleeps 9pm-5am',
      bio: 'Senior. Morning workouts and coffee runs. Respectful roommate.',
      tags: ['fitness', 'organized', 'quiet'],
      cleanliness: 5,
      communication: 4,
      socialLevel: 3,
    },
  },
];

async function seedHalls() {
  console.log('Seeding halls...');
  for (const hall of halls) {
    await prisma.hall.upsert({
      where: { name: hall.name },
      create: hall,
      update: hall,
    });
  }
  console.log(`✓ Seeded ${halls.length} halls`);
}

async function seedUsers() {
  console.log('Seeding test users...');
  for (const testUser of TEST_USERS) {
    const user = await prisma.user.upsert({
      where: { email: testUser.email },
      update: {
        displayName: testUser.displayName,
        nyuVerified: true,
      },
      create: {
        email: testUser.email,
        displayName: testUser.displayName,
        nyuVerified: true,
      },
    });

    const profile = await prisma.roommateProfile.upsert({
      where: { userId: user.id },
      update: testUser.profile,
      create: {
        userId: user.id,
        ...testUser.profile,
      },
    });
  }
  console.log(`✓ Seeded ${TEST_USERS.length} users with profiles`);
}

async function seedReviews() {
  console.log('Seeding reviews...');
  const users = await prisma.user.findMany();
  const profiles = await prisma.roommateProfile.findMany();

  let reviewCount = 0;
  for (let i = 0; i < users.length; i++) {
    const reviewees = profiles
      .filter((p) => p.userId !== users[i].id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    for (const reviewProfile of reviewees) {
      const scores = [3, 4, 5, 4, 3, 5][Math.floor(Math.random() * 6)];
      const comments = [
        'Great roommate! Very respectful and communicative.',
        'Amazing person to live with. Would definitely room again.',
        'Pretty good, but could improve on cleaning.',
        'Nice person but different schedules made it tricky.',
        'Solid roommate, very responsible and friendly.',
        'Excellent roommate! Highly recommend.',
      ];

      const existing = await prisma.review.findFirst({
        where: { profileId: reviewProfile.id, authorId: users[i].id },
      });

      if (!existing) {
        await prisma.review.create({
          data: {
            profileId: reviewProfile.id,
            authorId: users[i].id,
            cleanliness: scores,
            communication: scores,
            sleep: scores,
            vibeScore: scores,
            comment: comments[Math.floor(Math.random() * comments.length)],
          },
        });
        reviewCount++;
      }
    }
  }

  // Update profile ratings
  for (const profile of profiles) {
    const reviews = await prisma.review.findMany({ where: { profileId: profile.id } });
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((sum, r) => sum + r.vibeScore, 0) / reviews.length;
      await prisma.roommateProfile.update({
        where: { id: profile.id },
        data: {
          averageRating: avgRating,
          reviewCount: reviews.length,
        },
      });
    }
  }

  console.log(`✓ Seeded ${reviewCount} reviews`);
}

async function main() {
  try {
    await seedHalls();
    await seedUsers();
    await seedReviews();
    console.log('\n✓ Database seed complete!');
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
