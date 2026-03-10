import Link from "next/link";

/**
 * Custom 404 page — shown when a route is not found.
 */
export default function NotFound() {
  return (
    <div className="error-page">
      <div className="error-page__content">
        <div className="error-page__code">404</div>
        <h1 className="error-page__title">Page not found</h1>
        <p className="error-page__message">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/" className="btn btn--primary btn--lg">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
