"use client";

import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__copy">© {year} IT-Akademy. MIT License.</p>
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
            <a href="mailto:contact@orizon.sx">Contact</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
