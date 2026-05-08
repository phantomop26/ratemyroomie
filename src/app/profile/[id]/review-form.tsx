'use client';

import { useState } from 'react';

export default function ReviewFormClient({ profileId }: { profileId: string }) {
  const [reviewComment, setReviewComment] = useState('');
  const [scores, setScores] = useState({ cleanliness: 5, communication: 5, sleep: 5 });
  const [submitting, setSubmitting] = useState(false);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmitting(true);
    try {
      const form = new FormData();
      form.append('profileId', profileId);
      form.append('comment', reviewComment);
      form.append('cleanliness', String(scores.cleanliness));
      form.append('communication', String(scores.communication));
      form.append('sleep', String(scores.sleep));

      const res = await fetch('/api/reviews', { method: 'POST', body: form });
      if (res.ok) {
        setReviewComment('');
        setScores({ cleanliness: 5, communication: 5, sleep: 5 });
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submitReview} className="form">
      <label>
        <span>Your review</span>
        <textarea
          placeholder="How was it living with this roommate?"
          value={reviewComment}
          onChange={(e) => setReviewComment(e.target.value)}
          rows={4}
          className="input"
        />
      </label>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <label>
          <span>Cleanliness: {scores.cleanliness}/5</span>
          <input
            type="range"
            min="1"
            max="5"
            value={scores.cleanliness}
            onChange={(e) => setScores({ ...scores, cleanliness: Number(e.target.value) })}
            className="input"
          />
        </label>
        <label>
          <span>Communication: {scores.communication}/5</span>
          <input
            type="range"
            min="1"
            max="5"
            value={scores.communication}
            onChange={(e) => setScores({ ...scores, communication: Number(e.target.value) })}
            className="input"
          />
        </label>
        <label>
          <span>Sleep Schedule: {scores.sleep}/5</span>
          <input
            type="range"
            min="1"
            max="5"
            value={scores.sleep}
            onChange={(e) => setScores({ ...scores, sleep: Number(e.target.value) })}
            className="input"
          />
        </label>
      </div>

      <button type="submit" className="button button-primary" disabled={submitting || !reviewComment.trim()}>
        {submitting ? 'Posting...' : 'Post Review'}
      </button>
    </form>
  );
}
