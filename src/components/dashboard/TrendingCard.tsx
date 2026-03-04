import type { TrendingRepo } from "@/lib/mock-data";

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function TrendingCard({ title, repos }: { title: string; repos: TrendingRepo[] }) {
  return (
    <div className="widget glass">
      <div className="widget__header">
        <h2 className="widget__title">{title}</h2>
        <span className="widget__badge">{repos.length} repos</span>
      </div>
      <ul className="trending">
        {repos.map((repo, i) => (
          <li key={repo.id} className="trending__item">
            <span className="trending__rank">#{i + 1}</span>
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="trending__link"
            >
              <div className="trending__info">
                <h3 className="trending__name">{repo.fullName}</h3>
                <p className="trending__desc">{repo.description}</p>
                <div className="trending__meta">
                  <span
                    className="trending__lang"
                    style={{ "--lang-color": repo.languageColor } as React.CSSProperties}
                  >
                    {repo.language}
                  </span>
                  <span className="trending__stars">⭐ {formatStars(repo.stars)}</span>
                  <span className="trending__today">+{repo.starsToday} today</span>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
