'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Navigation() {
  const pathname = usePathname();

  // Hide nav during active session
  if (pathname.startsWith('/session')) return null;

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        <Link href="/" className={`nav-item ${pathname === '/' ? 'active' : ''}`}>
          <span className="nav-icon">⚡</span>
          Today
        </Link>
        <Link href="/plan" className={`nav-item ${pathname === '/plan' ? 'active' : ''}`}>
          <span className="nav-icon">📅</span>
          Plan
        </Link>
        <Link href="/progress" className={`nav-item ${pathname === '/progress' ? 'active' : ''}`}>
          <span className="nav-icon">📊</span>
          Progress
        </Link>
      </div>
    </nav>
  );
}
