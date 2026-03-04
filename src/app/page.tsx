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
                        Build at the{" "}
                        <span className="hero__title-gradient">Edge</span>
                    </h1>

                    <p className="hero__subtitle animate-fade-in-up animate-delay-2">
                        Next.js 15 · AWS CloudFront · Terraform IaC · Claude AI.
                        Everything you need to ship fast, deploy globally, and iterate
                        with confidence.
                    </p>

                    <div className="hero__actions animate-fade-in-up animate-delay-3">
                        <a href="#features" className="btn btn--primary btn--lg">
                            Explore Features
                        </a>
                        <a
                            href="https://github.com/itakademy/tech-portal"
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
                                    <span className="comment">
                                        {`# Deploy to CloudFront in one command`}
                                    </span>
                                    {"\n"}
                                    <span className="function">{"npm"}</span>
                                    {" run build"}
                                    {"\n"}
                                    <span className="function">{"make"}</span>
                                    {" deploy "}
                                    <span className="string">{"ENV=production"}</span>
                                    {"\n\n"}
                                    <span className="comment">
                                        {"# Or let CI/CD handle it"}
                                    </span>
                                    {"\n"}
                                    <span className="function">{"git"}</span>
                                    {" push origin "}
                                    <span className="string">{"main"}</span>
                                    {" "}
                                    <span className="comment">
                                        {"# → auto-deploy 🚀"}
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
                        <h2 className="features__title">
                            Everything Included
                        </h2>
                        <p className="features__subtitle">
                            A curated stack for modern web applications, from infrastructure
                            to developer experience.
                        </p>
                    </div>

                    <div className="features__grid">
                        <div className="feature-card glass animate-fade-in-up animate-delay-1">
                            <div className="feature-card__icon">⚡</div>
                            <h3 className="feature-card__title">Static Edge Delivery</h3>
                            <p className="feature-card__description">
                                Next.js static export served through AWS CloudFront. Sub-second
                                global load times with edge caching and CloudFront Functions.
                            </p>
                        </div>

                        <div className="feature-card glass animate-fade-in-up animate-delay-2">
                            <div className="feature-card__icon">🏗️</div>
                            <h3 className="feature-card__title">Terraform IaC</h3>
                            <p className="feature-card__description">
                                Complete infrastructure as code: S3, CloudFront, OAC, ACM,
                                Route53. Version-controlled, repeatable, and auditable.
                            </p>
                        </div>

                        <div className="feature-card glass animate-fade-in-up animate-delay-3">
                            <div className="feature-card__icon">🔄</div>
                            <h3 className="feature-card__title">GitHub Actions CI/CD</h3>
                            <p className="feature-card__description">
                                Automated pipelines for build, lint, type-check, and deploy.
                                PR previews with Terraform plan. Merge to main to ship.
                            </p>
                        </div>

                        <div className="feature-card glass animate-fade-in-up animate-delay-4">
                            <div className="feature-card__icon">🤖</div>
                            <h3 className="feature-card__title">Claude AI Integration</h3>
                            <p className="feature-card__description">
                                CLAUDE.md project context, .claude settings, and architecture
                                docs. Optimized for pair programming with Claude Opus 4.6.
                            </p>
                        </div>

                        <div className="feature-card glass animate-fade-in-up animate-delay-5">
                            <div className="feature-card__icon">🛡️</div>
                            <h3 className="feature-card__title">TypeScript Strict</h3>
                            <p className="feature-card__description">
                                Full strict mode TypeScript with ESLint, Prettier, and path
                                aliases. Catch bugs at compile time, not in production.
                            </p>
                        </div>

                        <div className="feature-card glass animate-fade-in-up animate-delay-1">
                            <div className="feature-card__icon">🎨</div>
                            <h3 className="feature-card__title">Premium Design System</h3>
                            <p className="feature-card__description">
                                CSS custom properties, dark theme, glassmorphism, micro-animations.
                                No utility-class fatigue — just clean, maintainable styles.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
