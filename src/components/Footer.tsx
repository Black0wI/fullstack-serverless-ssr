"use client";

import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__copy">© {year} Next.js SST Boilerplate. MIT License.</p>
        <ul className="footer__links">
          <li>
            <a
              href="https://github.com/Black0wI/nextjs-static-edge-template"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
          <li>
            <Link href="/docs">Documentation</Link>
          </li>
          <li>
            <a href="mailto:maintainers@example.com">Contact</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
