/**
 * Global loading skeleton — shown during Suspense boundaries and page transitions.
 */
export default function Loading() {
  return (
    <div className="loading-page">
      <div className="loading-page__spinner" />
      <p className="loading-page__text">Loading...</p>
    </div>
  );
}
