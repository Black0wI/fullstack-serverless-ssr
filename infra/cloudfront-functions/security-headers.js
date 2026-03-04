// CloudFront Function: Security Headers
// Adds CSP, HSTS, and other security headers to all responses
// Runtime: cloudfront-js-2.0 (viewer-response event)

function handler(event) {
    var response = event.response;
    var headers = response.headers;

    headers['x-content-type-options'] = { value: 'nosniff' };
    headers['x-frame-options'] = { value: 'DENY' };
    headers['x-xss-protection'] = { value: '1; mode=block' };
    headers['referrer-policy'] = { value: 'strict-origin-when-cross-origin' };
    headers['permissions-policy'] = { value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' };
    headers['strict-transport-security'] = { value: 'max-age=63072000; includeSubDomains; preload' };
    headers['content-security-policy'] = {
        value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "connect-src 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'"
        ].join('; ')
    };

    return response;
}
