import type { Metadata } from 'next';
import './globals.css';
import Header from './header';

export const metadata: Metadata = {
  title: 'Rate My Roommate | NYU',
  description: 'NYU-only roommate ratings with persistent accounts and database-backed profiles.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}