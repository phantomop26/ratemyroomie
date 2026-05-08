import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { getHalls } from '@/lib/halls';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/join');
  }

  const [profile, reviews, halls] = await Promise.all([
    prisma.roommateProfile.findUnique({
      where: { userId: user.id },
      include: { reviews: { orderBy: { createdAt: 'desc' }, take: 5 } },
    }),
    prisma.review.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: {
        profile: { select: { fullName: true, dorm: true } },
      },
    }),
    getHalls(),
  ]);

  return (
    <main className="shell dashboard">
      <div className="dashboard-head">
        <div>
          <p className="eyebrow">Your account</p>
          <h1 style={{ maxWidth: '12ch', fontSize: 'clamp(2.4rem, 6vw, 4.2rem)' }}>Welcome back</h1>
          <p className="muted">{user.email}</p>
        </div>
        <div className="toolbar">
          <Link className="button button-secondary" href="/">
            Home
          </Link>
        </div>
      </div>

      <section className="panel profile-grid">
        <div>
          <p className="eyebrow">Profile</p>
          <h2>Your roommate card</h2>
          {profile ? (
            <div className="stack">
              <div className="profile-row">
                <span className="profile-pill">{profile.fullName}</span>
                <span className="profile-pill">{profile.dorm}</span>
                <span className="profile-pill">{profile.vibe}</span>
              </div>
              <p>{profile.bio ?? 'No bio saved yet.'}</p>
              <p className="muted">
                Rating: {profile.averageRating.toFixed(1)} from {profile.reviewCount} reviews
              </p>
            </div>
          ) : (
            <div>
              <div className="empty">No profile yet. Create one using the form below.</div>
              <form action="/api/profiles" method="post" className="form" style={{ marginTop: 14 }}>
                <label>
                  Full name
                  <input className="input" name="fullName" required />
                </label>
                <label>
                  Dorm
                  <select className="input" name="dorm" required>
                    <option value="">Choose dorm</option>
                    {halls.map((h) => (
                      <option key={h.id} value={h.name}>{h.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Vibe
                  <input className="input" name="vibe" required />
                </label>
                <label>
                  Sleep schedule
                  <input className="input" name="sleepSchedule" required />
                </label>
                <label>
                  Short bio
                  <textarea className="input" name="bio" />
                </label>
                <label>
                  Tags (comma separated)
                  <input className="input" name="tags" />
                </label>
                <div className="form-row">
                  <label>
                    Cleanliness
                    <input className="input" name="cleanliness" type="number" min="1" max="5" defaultValue={4} />
                  </label>
                  <label>
                    Communication
                    <input className="input" name="communication" type="number" min="1" max="5" defaultValue={4} />
                  </label>
                  <label>
                    Social
                    <input className="input" name="socialLevel" type="number" min="1" max="5" defaultValue={3} />
                  </label>
                </div>
                <button className="button button-primary" type="submit">Save profile</button>
              </form>
            </div>
          )}
        </div>

        <div>
          <p className="eyebrow">History</p>
          <h2>Reviews you wrote</h2>
          <div className="activity">
            {reviews.length ? (
              reviews.map((review) => (
                <article className="review-card" key={review.id}>
                  <strong>{review.profile.fullName}</strong>
                  <p className="muted">{review.profile.dorm}</p>
                  <p>{review.comment}</p>
                </article>
              ))
            ) : (
              <div className="empty">No reviews yet. Your account data is ready to be reused when you post.</div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}