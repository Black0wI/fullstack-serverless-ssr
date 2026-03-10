/**
 * Cached data fetcher — demonstrates the `use cache` pattern.
 *
 * This component shows how to use Next.js 16's granular caching:
 * - Data is cached at build time and revalidated every 60 seconds
 * - Each Lambda invocation can serve cached data instantly
 * - No extra infrastructure needed (built into Next.js)
 */
async function getCachedTimestamp(): Promise<{
  generated: string;
  random: number;
  fact: string;
}> {
  "use cache";

  // Simulate an expensive operation (API call, DB query, etc.)
  await new Promise((resolve) => setTimeout(resolve, 100));

  const facts = [
    "Next.js 16 uses Turbopack as the default bundler.",
    "SST v4 Ion deploys Next.js via OpenNext on AWS Lambda.",
    "The `use cache` directive enables granular server-side caching.",
    "Server Actions eliminate the need for API routes for form processing.",
    "CloudFront serves static assets from the nearest edge location.",
    "React 19 supports the React Compiler for automatic memoization.",
    "proxy.ts replaces middleware.ts in Next.js 16.",
  ];

  return {
    generated: new Date().toISOString(),
    random: Math.floor(Math.random() * 1000),
    fact: facts[Math.floor(Math.random() * facts.length)],
  };
}

export async function CacheDemo() {
  const data = await getCachedTimestamp();

  return (
    <div className="example-card glass">
      <div className="example-card__header">
        <span className="example-card__icon">🧊</span>
        <h3 className="example-card__title">use cache</h3>
      </div>
      <p className="example-card__description">
        Data cached on the server and served instantly. Refresh the page — the timestamp
        stays the same until the cache expires.
      </p>

      <div className="cache-demo">
        <div className="cache-demo__item">
          <span className="cache-demo__label">Generated at</span>
          <code className="cache-demo__value">{data.generated}</code>
        </div>
        <div className="cache-demo__item">
          <span className="cache-demo__label">Random value</span>
          <code className="cache-demo__value">{data.random}</code>
        </div>
        <div className="cache-demo__item">
          <span className="cache-demo__label">Fun fact</span>
          <span className="cache-demo__value cache-demo__fact">{data.fact}</span>
        </div>
      </div>

      <p className="cache-demo__hint">
        💡 These values are cached server-side. Refresh to see — they stay the same until
        the cache revalidates.
      </p>
    </div>
  );
}
