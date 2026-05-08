import Link from 'next/link';
import { getHalls } from '@/lib/halls';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type JoinSearchParams = {
  error?: string;
  smtpMessage?: string;
};

function getJoinErrorMessage(error?: string, smtpMessage?: string) {
  if (error === 'nyu-email') {
    return 'Only @nyu.edu emails are accepted for this beta.';
  }

  if (error === 'smtp') {
    return smtpMessage
      ? `Email delivery is misconfigured right now: ${smtpMessage}`
      : 'Email delivery is misconfigured right now. Please try again later or check the SMTP settings.';
  }

  if (error === 'no-user') {
    return 'That account could not be reopened. Please request a new verification code from the join page.';
  }

  return '';
}

export default async function JoinPage({ searchParams }: { searchParams?: Promise<JoinSearchParams> }) {
  const params = searchParams ? await searchParams : undefined;
  const errorMessage = getJoinErrorMessage(params?.error, params?.smtpMessage);
  const halls = await getHalls();

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
          {errorMessage && <p className="help error">{errorMessage}</p>}
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