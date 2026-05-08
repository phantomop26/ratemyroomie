import Link from 'next/link';
import { cookies } from 'next/headers';

export default function VerifyPage({ searchParams }: { searchParams?: Record<string, string> }) {
  const email = searchParams?.email ?? '';
  const devCode = searchParams?.devCode ?? '';
  const error = searchParams?.error ?? '';

  return (
    <main className="shell">
      <section className="panel">
        <p className="eyebrow">Verify</p>
        <h1>Enter the code sent to your NYU email</h1>
        {error === 'invalid' && <p className="help error">Invalid or expired code.</p>}
        <form action="/api/auth/verify" method="post" className="form">
          <label>
            Email
            <input className="input" name="email" type="email" defaultValue={email} required />
          </label>
          <label>
            Code
            <input className="input" name="code" type="text" inputMode="numeric" required />
          </label>
          <input type="hidden" name="redirectTo" value="/dashboard" />
          <button className="button button-primary" type="submit">Verify and open account</button>
        </form>
        {devCode && (
          <div className="card" style={{ marginTop: 12 }}>
            <p className="muted">Dev-only: your code is</p>
            <strong>{devCode}</strong>
          </div>
        )}
        <p style={{ marginTop: 12 }}>
          <Link href="/join" className="button button-secondary">Back</Link>
        </p>
      </section>
    </main>
  );
}
