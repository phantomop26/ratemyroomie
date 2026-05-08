'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DEFAULT_HALLS } from '@/lib/halls';

interface Profile {
  id: string;
  fullName: string;
  dorm: string;
  vibe?: string;
  averageRating: number;
  reviewCount: number;
}

export default function PostReviewPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'search' | 'new'>('search');
  const [halls, setHalls] = useState<{ id: string; name: string }[]>([]);
  
  // Search mode
  const [searchQuery, setSearchQuery] = useState('');
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [searching, setSearching] = useState(false);

  // New roommate mode
  const [newName, setNewName] = useState('');
  const [newDorm, setNewDorm] = useState('');
  const [newVibe, setNewVibe] = useState('');
  
  // Review form
  const [reviewComment, setReviewComment] = useState('');
  const [scores, setScores] = useState({ cleanliness: 5, communication: 5, sleep: 5 });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadHalls() {
      const res = await fetch('/api/halls', { cache: 'no-store' });
      const data = await res.json();
      setHalls(Array.isArray(data) && data.length ? data : DEFAULT_HALLS);
    }
    loadHalls();
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim() && mode === 'search') {
        setSearching(true);
        const res = await fetch('/api/profiles');
        const data: Profile[] = await res.json();
        const filtered = data.filter(p => 
          p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.dorm.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setProfiles(filtered);
        setSearching(false);
      } else {
        setProfiles([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, mode]);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    if (mode === 'search' && !selectedProfile) return;
    if (mode === 'new' && (!newName.trim() || !newDorm)) return;

    setSubmitting(true);
    try {
      let profileId = selectedProfile?.id;

      // If new roommate, create profile first
      if (mode === 'new') {
        const profileRes = await fetch('/api/profiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: newName,
            dorm: newDorm,
            vibe: newVibe || 'Unknown',
            bio: 'Reviewed by community members',
            sleepSchedule: 'Unknown',
          }),
        });
        if (!profileRes.ok) throw new Error('Failed to create profile');
        const newProfile = await profileRes.json();
        profileId = newProfile.id;
      }

      // Post review
      const form = new FormData();
      form.append('profileId', profileId!);
      form.append('comment', reviewComment);
      form.append('cleanliness', String(scores.cleanliness));
      form.append('communication', String(scores.communication));
      form.append('sleep', String(scores.sleep));

      const res = await fetch('/api/reviews', { method: 'POST', body: form });
      if (res.ok) {
        router.push(`/profile/${profileId}`);
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to post review. Try again?');
    } finally {
      setSubmitting(false);
    }
  }

  const target = mode === 'search' ? selectedProfile : { fullName: newName, dorm: newDorm };

  return (
    <main className="shell">
      <header className="panel section">
        <Link href="/" className="button button-secondary" style={{ marginBottom: '1rem' }}>
          ← Back to home
        </Link>
        <p className="eyebrow">Community Reviews</p>
        <h1>Post a Roommate Review</h1>
        <p className="lede">Help other NYU students find the best roommates. Review anyone, even if they're not on our platform yet.</p>
      </header>

      <section className="panel">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => { setMode('search'); setSelectedProfile(null); }}
            className={mode === 'search' ? 'button button-primary' : 'button button-secondary'}
          >
            Search Existing Roommate
          </button>
          <button
            onClick={() => { setMode('new'); setSearchQuery(''); }}
            className={mode === 'new' ? 'button button-primary' : 'button button-secondary'}
          >
            Post About Someone New
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <h2 style={{ marginBottom: '1rem' }}>
              {mode === 'search' ? 'Search Roommates' : 'New Profile'}
            </h2>

            {mode === 'search' ? (
              <div>
                <label style={{ display: 'block', marginBottom: '1rem' }}>
                  <strong>Search by name or dorm</strong>
                  <input
                    type="text"
                    placeholder="e.g., Alice or Rubin Hall"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input"
                    style={{ marginTop: '0.5rem' }}
                  />
                </label>

                {searching ? (
                  <p className="muted">Searching...</p>
                ) : searchQuery ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {profiles.length ? (
                      profiles.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setSelectedProfile(p)}
                          className={selectedProfile?.id === p.id ? 'button button-primary' : 'button button-secondary'}
                          style={{ textAlign: 'left', justifyContent: 'space-between', display: 'flex' }}
                        >
                          <div>
                            <strong>{p.fullName}</strong>
                            <p className="muted" style={{ fontSize: '0.85rem' }}>
                              {p.dorm} · {p.averageRating.toFixed(1)} ({p.reviewCount} reviews)
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <p className="muted">No roommates found. Post about someone new instead!</p>
                    )}
                  </div>
                ) : null}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label>
                  <strong>Roommate's name</strong>
                  <input
                    type="text"
                    placeholder="e.g., Alice Chen"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="input"
                    style={{ marginTop: '0.5rem' }}
                  />
                </label>

                <label>
                  <strong>Dorm</strong>
                  <select
                    value={newDorm}
                    onChange={(e) => setNewDorm(e.target.value)}
                    className="input"
                    style={{ marginTop: '0.5rem' }}
                  >
                    <option value="">Choose a dorm</option>
                    {halls.map((h) => (
                      <option key={h.id} value={h.name}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <strong>Roommate's vibe (optional)</strong>
                  <select
                    value={newVibe}
                    onChange={(e) => setNewVibe(e.target.value)}
                    className="input"
                    style={{ marginTop: '0.5rem' }}
                  >
                    <option value="">Choose or skip</option>
                    <option value="Night Owl">Night Owl</option>
                    <option value="Early Bird">Early Bird</option>
                    <option value="Party">Party</option>
                    <option value="Chill">Chill</option>
                    <option value="Study Focused">Study Focused</option>
                    <option value="Social Butterfly">Social Butterfly</option>
                  </select>
                </label>
              </div>
            )}
          </div>

          <div>
            <h2 style={{ marginBottom: '1rem' }}>Your Review</h2>

            {target ? (
              <form onSubmit={submitReview}>
                <div style={{ marginBottom: '1rem', padding: '1rem', borderRadius: '8px', background: 'rgba(248,197,106,0.1)', borderLeft: '3px solid var(--accent)' }}>
                  <strong>{target.fullName}</strong>
                  <p className="muted">{target.dorm}</p>
                </div>

                <label style={{ display: 'block', marginBottom: '1.5rem' }}>
                  <strong>Your experience</strong>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="How was it living with this roommate? What should others know?"
                    className="input"
                    rows={4}
                    style={{ marginTop: '0.5rem' }}
                  />
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      <small><strong>Cleanliness: {scores.cleanliness}/5</strong></small>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={scores.cleanliness}
                      onChange={(e) => setScores({ ...scores, cleanliness: Number(e.target.value) })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      <small><strong>Communication: {scores.communication}/5</strong></small>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={scores.communication}
                      onChange={(e) => setScores({ ...scores, communication: Number(e.target.value) })}
                      className="input"
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                      <small><strong>Sleep: {scores.sleep}/5</strong></small>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={scores.sleep}
                      onChange={(e) => setScores({ ...scores, sleep: Number(e.target.value) })}
                      className="input"
                    />
                  </div>
                </div>

                <button type="submit" className="button" disabled={submitting || !reviewComment.trim()}>
                  {submitting ? 'Posting...' : 'Post Review'}
                </button>
              </form>
            ) : (
              <p className="muted">
                {mode === 'search'
                  ? 'Search for a roommate to write a review'
                  : 'Fill in the roommate details to the left'}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
