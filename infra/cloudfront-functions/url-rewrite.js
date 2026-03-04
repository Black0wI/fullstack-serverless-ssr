// CloudFront Function: URL Rewrite for Next.js Static Export
// Handles trailing slashes and index.html resolution
// Runtime: cloudfront-js-2.0

function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // If the URI ends with '/', append 'index.html'
    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    }
    // If the URI doesn't have a file extension, add '/index.html'
    else if (!uri.includes('.')) {
        request.uri += '/index.html';
    }

    return request;
}
