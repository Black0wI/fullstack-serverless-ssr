import Link from "next/link";

export function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <Link href="/" className="header__logo">
          <span className="header__logo-icon">NS</span>
          <span className="header__logo-text">Next.js SST Boilerplate</span>
        </Link>

        <nav>
          <ul className="header__nav">
            <li>
              <Link href="/#features">Features</Link>
            </li>
            <li>
              <Link href="/examples/">Examples</Link>
            </li>
            <li>
              <Link href="/docs/">Docs</Link>
            </li>
            <li>
              <a
                href="https://github.com/Black0wI/nextjs-static-edge-template"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>

        <div className="header__actions">
          <Link href="/#hero" className="btn btn--primary">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
