import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';

export default async function Header() {
  const user = await getSessionUser();

  return (
    <header className="app-header">
      <div className="app-header-content">
        <Link href="/" className="app-logo">
          Rate My Roommate
        </Link>
        <nav className="app-nav">
          <Link href="/" className="app-nav-link">
            Home
          </Link>
          {user ? (
            <>
              <Link href="/post-review" className="app-nav-link">
                Post Review
              </Link>
              <Link href="/browse" className="app-nav-link">
                Browse
              </Link>
              <Link href="/dashboard" className="app-nav-link">
                My Profile
              </Link>
              <form action="/api/logout" method="POST" style={{ display: 'inline' }}>
                <button type="submit" className="app-nav-link app-nav-logout">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link href="/join" className="app-nav-link app-nav-join">
              Join
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
