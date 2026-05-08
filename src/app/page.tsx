import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { getHomepageData } from '@/lib/data';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function stars(value: number) {
  return '★★★★★'.slice(0, value) + '☆☆☆☆☆'.slice(0, 5 - value);
}

function normalizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) return [];
  return tags.filter((tag): tag is string => typeof tag === 'string');
}

function getPublicReviewerLabel() {
  return 'NYU student';
}

export default async function HomePage() {
  const [user, data] = await Promise.all([getSessionUser(), getHomepageData()]);

  return (
    <main className="shell">
      <header className="hero">
        <section>
          <p className="eyebrow">NYU only · live roommate network</p>
          <h1>Rate My Roommate</h1>
          <p className="lede">
            Find & rate your roommates. Browse profiles by dorm, post reviews, and help the community make better choices.
          </p>

          <div className="hero-actions">
            <Link className="button button-primary" href="/join">
              Join with NYU email
            </Link>
            <Link className="button button-secondary" href="/browse">
              Browse profiles
            </Link>
          </div>

          <div className="stat-row">
            <div className="stat">
              <strong>{data.profiles.length}</strong>
              <span className="muted">live NYU roommate profiles</span>
            </div>
            <div className="stat">
              <strong>{data.reviews.length}</strong>
              <span className="muted">reviews posted</span>
            </div>
            <div className="stat">
              <strong>{data.halls.length}</strong>
              <span className="muted">NYU residence halls</span>
            </div>
          </div>
        </section>

        <aside className="hero-side">
          <div className="card">
            <div className="card-head">
              <span className="badge">Find by dorm</span>
              <span className="badge pill-muted">Search live</span>
            </div>
            <h2>Quick dorm search</h2>
            <p className="muted">
              Filter roommates by their residence hall. Browse by dorm to find profiles from your building or others.
            </p>
            <Link className="button button-secondary" href="/browse">
              Browse all dorms →
            </Link>
          </div>

          <div className="card">
            <div className="card-head">
              <span className="badge">Post reviews</span>
            </div>
            <h2>Share your experience</h2>
            <p className="muted">
              Post a review about any roommate — whether they're in our system or not. Help the NYU community find the best roommates.
            </p>
            {user ? (
              <Link className="button button-primary" href="/post-review">
                Post a review →
              </Link>
            ) : (
              <Link className="button button-primary" href="/join">
                Join to post
              </Link>
            )}
          </div>
        </aside>
      </header>

      <section className="panel section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Find roommates by dorm</p>
            <h2>Search NYU residence halls</h2>
          </div>
        </div>
        <div className="dorm-grid">
          {data.halls.slice(0, 12).map((hall) => (
            <Link
              key={hall.id}
              href={`/browse?dorm=${encodeURIComponent(hall.name)}`}
              className="dorm-card"
            >
              <div>
                <strong>{hall.name}</strong>
                <p className="muted">{hall.style}</p>
              </div>
              <span className="arrow">→</span>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link href="/browse" className="button button-secondary">
            View all dorms & profiles
          </Link>
        </div>
      </section>

      <section id="board" className="panel section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Live board</p>
            <h2>Featured NYU roommate profiles</h2>
          </div>
          <Link className="button button-secondary" href={user ? '/dashboard' : '/join'}>
            {user ? 'Manage account' : 'Start account'}
          </Link>
        </div>

        <div className="grid">
          {data.profiles.length ? (
            data.profiles.map((profile) => {
              const tags = normalizeTags(profile.tags);
              return (
              <Link href={`/profile/${profile.id}`} key={profile.id}>
                <article className="roommate-card browse-card">
                  <div className="card-head">
                    <div>
                      <h3>{profile.fullName}</h3>
                      <p className="muted">
                        {profile.dorm} · {profile.vibe}
                      </p>
                    </div>
                    <strong style={{ fontSize: '1.5rem', color: '#f8c56a' }}>
                      {profile.averageRating.toFixed(1)}
                    </strong>
                  </div>
                  <p>{profile.bio ?? 'No bio yet, just a live profile.'}</p>
                  <div className="tag-row">
                    {tags.slice(0, 3).map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                    {tags.length > 3 && <span className="tag muted">+{tags.length - 3}</span>}
                  </div>
                  <p className="muted">{profile.reviewCount} reviews</p>
                </article>
              </Link>
              );
            })
          ) : (
            <div className="empty">No roommate profiles yet. Be the first NYU student to publish one.</div>
          )}
        </div>
      </section>

      <section className="panel section-grid">
        <div>
          <p className="eyebrow">Recent activity</p>
          <h2>Latest reviews</h2>
          <div className="activity review-grid">
            {data.reviews.length ? (
              data.reviews.map((review) => (
                <article className="review-card" key={review.id}>
                  <div className="card-head">
                    <div>
                      <h3>{review.profile.fullName}</h3>
                      <p className="muted">
                        {review.profile.dorm} · {review.profile.vibe}
                      </p>
                    </div>
                    <strong>{stars(review.vibeScore)}</strong>
                  </div>
                  <p>{review.comment}</p>
                  <p className="muted">Posted by {getPublicReviewerLabel()}</p>
                </article>
              ))
            ) : (
              <div className="empty">No reviews yet.</div>
            )}
          </div>
        </div>

        <div className="card">
          <p className="eyebrow">How it works</p>
          <h2>3-step review</h2>
          <div className="stack">
            <div>
              <strong style={{ color: '#f8c56a' }}>1. Browse</strong>
              <p className="muted">Find profiles by dorm, vibe, or search by name.</p>
            </div>
            <div>
              <strong style={{ color: '#68dbc5' }}>2. Click</strong>
              <p className="muted">Open a profile to see all their reviews and details.</p>
            </div>
            <div>
              <strong style={{ color: '#ff6f7d' }}>3. Review</strong>
              <p className="muted">Post your experience with scores. Takes 1 minute.</p>
            </div>
          </div>
          {user ? (
            <Link href="/browse" className="button button-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
              Browse & review →
            </Link>
          ) : (
            <Link href="/join" className="button button-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
              Join to review →
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
