import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import ReviewFormClient from './review-form';

function stars(value: number) {
  return '★★★★★'.slice(0, value) + '☆☆☆☆☆'.slice(0, 5 - value);
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: profileId } = await params;

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
    return (
      <main className="shell">
        <div className="empty">Profile not found</div>
      </main>
    );
  }

  const sessionUser = await getSessionUser();

  return (
    <main className="shell">
      <header className="panel section" style={{ marginBottom: '2rem' }}>
        <Link href="/browse" className="button button-secondary" style={{ marginBottom: '1rem' }}>
          ← Back to browse
        </Link>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'start' }}>
          <div>
            <h1>{profile.fullName}</h1>
            <p className="lede">
              {profile.dorm} · {profile.vibe} · {profile.sleepSchedule}
            </p>
            <p>{profile.bio}</p>
            <div className="tag-row" style={{ marginTop: '1rem' }}>
              {profile.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-head">
              <span>Roommate Profile</span>
              <strong style={{ fontSize: '2rem', color: '#f8c56a' }}>{profile.averageRating.toFixed(1)}</strong>
            </div>
            <div className="stat-row" style={{ marginTop: '1rem' }}>
              <div className="stat">
                <strong>{profile.cleanliness}</strong>
                <span className="muted">Cleanliness</span>
              </div>
              <div className="stat">
                <strong>{profile.communication}</strong>
                <span className="muted">Communication</span>
              </div>
              <div className="stat">
                <strong>{profile.socialLevel}</strong>
                <span className="muted">Social Level</span>
              </div>
            </div>
            <p className="muted" style={{ marginTop: '1rem' }}>
              {profile.reviewCount} reviews from NYU students
            </p>
          </div>
        </div>
      </header>

      <section className="panel section-grid">
        <div>
          <p className="eyebrow">Leave a review</p>
          <h2>Share your experience</h2>
          {sessionUser ? (
            sessionUser.id !== profile.userId ? (
              <ReviewFormClient profileId={profileId} />
            ) : (
              <p className="muted">This is your profile. You can't review yourself.</p>
            )
          ) : (
            <p className="muted">
              <Link href="/join" className="button button-secondary">
                Join NYU
              </Link>
              {' '}to post a review
            </p>
          )}
        </div>

        <div>
          <p className="eyebrow">Reviews ({profile.reviewCount})</p>
          <h2>What others say</h2>
          <div className="activity review-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {profile.reviews.length ? (
              profile.reviews.map((review) => (
                <article key={review.id} className="review-card" style={{ padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="card-head">
                    <div>
                      <h3>{review.author.displayName || review.author.email.split('@')[0]}</h3>
                      <p className="muted">{stars(review.vibeScore)}</p>
                    </div>
                  </div>
                  <p>{review.comment}</p>
                  <div className="stat-row" style={{ marginTop: '0.5rem' }}>
                    <span className="muted">✓ Clean: {review.cleanliness}</span>
                    <span className="muted">✓ Comms: {review.communication}</span>
                    <span className="muted">✓ Sleep: {review.sleep}</span>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty">No reviews yet. Be the first to review!</div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

