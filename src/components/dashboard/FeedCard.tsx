import type { FeedItem } from "@/lib/mock-data";

export function FeedCard({ title, items }: { title: string; items: FeedItem[] }) {
  return (
    <div className="widget glass">
      <div className="widget__header">
        <h2 className="widget__title">{title}</h2>
        <span className="widget__badge">{items.length} articles</span>
      </div>
      <ul className="feed">
        {items.map((item) => (
          <li key={item.id} className="feed__item">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="feed__link"
            >
              <div className="feed__content">
                <h3 className="feed__title">{item.title}</h3>
                <div className="feed__meta">
                  <span className="feed__source">{item.source}</span>
                  <span className="feed__date">{item.date}</span>
                  {item.score && <span className="feed__score">▲ {item.score}</span>}
                </div>
              </div>
              <div className="feed__tags">
                {item.tags.map((tag) => (
                  <span key={tag} className="feed__tag">
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
