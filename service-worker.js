// service-worker.js - PWA Caching for Mausam (SIH 2026)
const CACHE_NAME = "mausam-cache-v1";
const ASSETS_TO_CACHE = [
    "./",
    "./index.html",
    "./css/style.css",
    "./js/script.js",
    "./js/weatherService.js",
    "./js/personaData.js",
    "./manifest.json"
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (e) => {
    // Stale-while-revalidate strategy for local assets, network-first for external APIs
    if (e.request.url.includes("api.open-meteo.com") || e.request.url.includes("bigdatacloud.net")) {
        e.respondWith(
            fetch(e.request).catch(() => caches.match(e.request))
        );
    } else {
        e.respondWith(
            caches.match(e.request).then((cached) => {
                return cached || fetch(e.request);
            })
        );
    }
});
