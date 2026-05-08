import Link from 'next/link';
import { prisma } from '@/lib/db';

function stars(value: number) {
  return '★★★★★'.slice(0, value) + '☆☆☆☆☆'.slice(0, 5 - value);
}

interface SearchParams {
  dorm?: string;
  vibe?: string;
  search?: string;
}

const VIBES = ['Night Owl', 'Early Bird', 'Party', 'Chill', 'Study Focused', 'Social Butterfly'];

export default async function BrowsePage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const selectedDorm = params.dorm || '';
  const selectedVibe = params.vibe || '';
  const searchQuery = (params.search || '').toLowerCase();

  // Fetch data server-side
  const [profiles, halls] = await Promise.all([
    prisma.roommateProfile.findMany({
      select: {
        id: true,
        fullName: true,
        dorm: true,
        vibe: true,
        bio: true,
        averageRating: true,
        reviewCount: true,
        tags: true,
      },
      orderBy: [{ averageRating: 'desc' }, { reviewCount: 'desc' }],
    }),
    prisma.hall.findMany({ orderBy: { name: 'asc' } }),
  ]);

  // Filter profiles
  const filtered = profiles.filter((p) => {
    const matchesDorm = !selectedDorm || p.dorm === selectedDorm;
    const matchesVibe = !selectedVibe || p.vibe === selectedVibe;
    const matchesSearch =
      !searchQuery ||
      p.fullName.toLowerCase().includes(searchQuery) ||
      p.bio?.toLowerCase().includes(searchQuery) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery));

    return matchesDorm && matchesVibe && matchesSearch;
  });

  return (
    <main className="shell">
      <header className="panel section">
        <div>
          <p className="eyebrow">Browse all profiles</p>
          <h1>Find Your Next Roommate</h1>
          <p className="lede">Filter by hall, vibe, and interests to find compatible roommates at NYU.</p>
        </div>
      </header>

      <section className="panel">
        <div className="filter-bar">
          <form action="/browse" method="GET" style={{ display: 'contents' }}>
            <input
              type="text"
              placeholder="Search by name, bio, or tags..."
              name="search"
              defaultValue={searchQuery}
              className="input"
            />

            <select name="dorm" defaultValue={selectedDorm} className="input">
              <option value="">All halls</option>
              {halls.map((h) => (
                <option key={h.id} value={h.name}>
                  {h.name}
                </option>
              ))}
            </select>

            <select name="vibe" defaultValue={selectedVibe} className="input">
              <option value="">All vibes</option>
              {VIBES.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>

            <button type="submit" className="button button-secondary">
              Search
            </button>
          </form>
        </div>

        <p className="muted" style={{ marginTop: '1rem' }}>
          Showing {filtered.length} of {profiles.length} profiles
          {selectedDorm && ` in ${selectedDorm}`}
          {selectedVibe && ` · ${selectedVibe}`}
        </p>
      </section>

      <section className="panel">
        {filtered.length ? (
          <div className="grid">
            {filtered.map((profile) => (
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
                  <p>{profile.bio ?? 'No bio yet.'}</p>
                  <div className="tag-row">
                    {profile.tags.slice(0, 3).map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                    {profile.tags.length > 3 && <span className="tag muted">+{profile.tags.length - 3}</span>}
                  </div>
                  <p className="muted">{profile.reviewCount} reviews</p>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty">No profiles match your filters. Try adjusting your search.</div>
        )}
      </section>
    </main>
  );
}
