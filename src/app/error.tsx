"use client";

/**
 * Global error boundary — catches runtime errors in the app.
 * Next.js App Router shows this automatically on unhandled errors.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-page">
      <div className="error-page__content">
        <div className="error-page__icon">⚠️</div>
        <h1 className="error-page__title">Something went wrong</h1>
        <p className="error-page__message">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        {error.digest && (
          <p className="error-page__digest">
            Error ID: <code>{error.digest}</code>
          </p>
        )}
        <button onClick={reset} className="btn btn--primary btn--lg">
          Try Again
        </button>
      </div>
    </div>
  );
}
