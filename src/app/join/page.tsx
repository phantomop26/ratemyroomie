import Link from 'next/link';
import { prisma } from '@/lib/db';

export default async function JoinPage() {
  const halls = await prisma.hall.findMany({ orderBy: { name: 'asc' } });

  return (
    <main className="shell">
      <section className="panel section-grid">
        <div>
          <p className="eyebrow">Account reopen</p>
          <h1 style={{ maxWidth: '10ch', fontSize: 'clamp(2.6rem, 7vw, 4.8rem)' }}>Join with your NYU email</h1>
          <p className="lede">
            This is the lightweight logic page for NYU verification. A valid NYU email creates or
            reopens your account, stores a session cookie, and keeps your profile data in the DB.
          </p>
          <Link className="button button-secondary" href="/">
            Back to home
          </Link>
        </div>

        <form className="form" action="/api/auth/send-code" method="post">
          <label>
            NYU email
            <input className="input" name="email" type="email" placeholder="name@nyu.edu" required />
          </label>
          <label>
            Display name
            <input className="input" name="displayName" type="text" placeholder="Optional" />
          </label>
          <label>
            Dorm (optional)
            <select className="input" name="dorm" defaultValue="">
              <option value="">Choose (optional)</option>
              {halls.map((h) => (
                <option key={h.id} value={h.name}>{h.name} — {h.style}</option>
              ))}
            </select>
          </label>
          <input type="hidden" name="redirectTo" value="/verify" />
          <button className="button button-primary" type="submit">
            Send verification code
          </button>
          <p className="help">
            Only @nyu.edu emails are accepted in this beta unless <strong>ALLOW_ANY_EMAIL=true</strong> for testing.
            Verification emails are sent from: <strong>{process.env.EMAIL_FROM || 'no-reply@ratemyroommate.nyu'}</strong>
          </p>
        </form>
      </section>
    </main>
  );
}