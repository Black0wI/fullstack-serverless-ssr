// Service Worker — Offline-first caching strategy
// Registered in layout.tsx for PWA support

const CACHE_NAME = "nextjs-sst-boilerplate-v1";
const STATIC_ASSETS = ["/", "/offline.html"];

// Install — pre-cache essential assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

// Fetch — network-first with cache fallback
self.addEventListener("fetch", (event) => {
    // Skip non-GET and cross-origin requests
    if (event.request.method !== "GET") return;
    if (!event.request.url.startsWith(self.location.origin)) return;

    // Cache-first for static assets (hashed filenames)
    if (event.request.url.includes("/_next/static/")) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) =>
                cache.match(event.request).then(
                    (cached) =>
                        cached ||
                        fetch(event.request).then((response) => {
                            cache.put(event.request, response.clone());
                            return response;
                        })
                )
            )
        );
        return;
    }

    // Network-first for HTML and other resources
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                return response;
            })
            .catch(() => caches.match(event.request).then((cached) => cached || caches.match("/offline.html")))
    );
});
