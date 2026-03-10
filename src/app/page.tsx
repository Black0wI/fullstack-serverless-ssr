import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* ── Hero Section ── */}
      <section className="hero" id="hero">
        <div className="hero__bg">
          <div className="hero__orb hero__orb--1" />
          <div className="hero__orb hero__orb--2" />
          <div className="hero__orb hero__orb--3" />
          <div className="hero__grid" />
        </div>

        <div className="container hero__content">
          <div className="animate-fade-in-up">
            <span className="badge">
              <span className="badge__dot" />
              Production Ready
            </span>
          </div>

          <h1 className="hero__title animate-fade-in-up animate-delay-1">
            Ship <span className="hero__title-gradient">Serverless</span> Fast
          </h1>

          <p className="hero__subtitle animate-fade-in-up animate-delay-2">
            Next.js 15 · SST v4 Ion · AWS Lambda + CloudFront · Cloudflare DNS. Full-stack
            SSR, deploy in one command, scale globally.
          </p>

          <div className="hero__actions animate-fade-in-up animate-delay-3">
            <Link href="/#features" className="btn btn--primary btn--lg">
              Explore Features
            </Link>
            <a
              href="https://github.com/Black0wI/nextjs-static-edge-template"
              className="btn btn--ghost btn--lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on GitHub →
            </a>
          </div>

          <div className="hero__code animate-fade-in-up animate-delay-4">
            <div className="hero__code-window">
              <div className="hero__code-header">
                <span className="hero__code-dot hero__code-dot--red" />
                <span className="hero__code-dot hero__code-dot--yellow" />
                <span className="hero__code-dot hero__code-dot--green" />
              </div>
              <pre className="hero__code-body">
                <code>
                  <span className="comment">{`# Deploy SSR to AWS in one command`}</span>
                  {"\n"}
                  <span className="function">{"npx"}</span>
                  {" sst deploy "}
                  <span className="string">{"--stage production"}</span>
                  {"\n\n"}
                  <span className="comment">{"# SST handles everything"}</span>
                  {"\n"}
                  <span className="comment">
                    {"# → Lambda + CloudFront + S3 + Cloudflare DNS 🚀"}
                  </span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="features" id="features">
        <div className="container">
          <div className="features__header animate-fade-in-up">
            <h2 className="features__title">Everything Included</h2>
            <p className="features__subtitle">
              A curated stack for modern web applications, from infrastructure to
              developer experience.
            </p>
          </div>

          <div className="features__grid">
            <div className="feature-card glass animate-fade-in-up animate-delay-1">
              <div className="feature-card__icon">⚡</div>
              <h3 className="feature-card__title">Full-Stack SSR</h3>
              <p className="feature-card__description">
                Server-side rendering via AWS Lambda and CloudFront. API Routes, Server
                Actions, ISR — all powered by OpenNext.
              </p>
            </div>

            <div className="feature-card glass animate-fade-in-up animate-delay-2">
              <div className="feature-card__icon">🏗️</div>
              <h3 className="feature-card__title">SST v4 Ion</h3>
              <p className="feature-card__description">
                Infrastructure as code with zero config. Lambda, CloudFront, S3,
                Cloudflare DNS — all managed by a single <code>sst.config.ts</code>.
              </p>
            </div>

            <div className="feature-card glass animate-fade-in-up animate-delay-3">
              <div className="feature-card__icon">🚀</div>
              <h3 className="feature-card__title">CLI Direct Deploy</h3>
              <p className="feature-card__description">
                No CI/CD pipeline needed. Deploy from your terminal with{" "}
                <code>npx sst deploy</code>. Built-in deploy guards prevent accidental
                conflicts.
              </p>
            </div>

            <div className="feature-card glass animate-fade-in-up animate-delay-4">
              <div className="feature-card__icon">🤖</div>
              <h3 className="feature-card__title">AI-Ready</h3>
              <p className="feature-card__description">
                CLAUDE.md project context, Cursor rules, and Antigravity workflows.
                Optimized for pair programming with AI assistants.
              </p>
            </div>

            <div className="feature-card glass animate-fade-in-up animate-delay-5">
              <div className="feature-card__icon">🛡️</div>
              <h3 className="feature-card__title">TypeScript Strict</h3>
              <p className="feature-card__description">
                Full strict mode TypeScript with ESLint, Prettier, and path aliases. Catch
                bugs at compile time, not in production.
              </p>
            </div>

            <div className="feature-card glass animate-fade-in-up animate-delay-1">
              <div className="feature-card__icon">🎨</div>
              <h3 className="feature-card__title">Premium Design System</h3>
              <p className="feature-card__description">
                CSS custom properties, dark theme, glassmorphism, micro-animations. No
                utility-class fatigue — just clean, maintainable styles.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
