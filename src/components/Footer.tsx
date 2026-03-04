export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__copy">© {year} Jean-Baptiste MONIN. MIT License.</p>
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
            <a href="/docs/">Documentation</a>
          </li>
          <li>
            <a href="mailto:contact@orizon.sx">Contact</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
