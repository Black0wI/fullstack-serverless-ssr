import Link from "next/link";

export function Header() {
  return (
    <header className="header">
      <div className="container header__inner">
        <Link href="/" className="header__logo">
          <span className="header__logo-icon">TP</span>
          <span className="header__logo-text">Tech Portal</span>
        </Link>

        <nav>
          <ul className="header__nav">
            <li>
              <a href="#features">Features</a>
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
          <a href="#hero" className="btn btn--primary">
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}
