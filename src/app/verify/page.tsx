import Link from 'next/link';

type VerifySearchParams = {
  email?: string;
  devCode?: string;
  error?: string;
};

export default async function VerifyPage({ searchParams }: { searchParams?: Promise<VerifySearchParams> }) {
  const params = searchParams ? await searchParams : undefined;
  const email = params?.email ?? '';
  const devCode = params?.devCode ?? '';
  const error = params?.error ?? '';

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
