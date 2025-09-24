const CACHE_NAME = 'meu-pwa-cache-v1';
const urlsToCache = [
    '/index.html',
    '/index.js',
    '/letra.json',
    '/letras.css',
    '/letras.html',
    '/letras.js',
    '/letras.py',
    '/login.css',
    '/login.html',
    '/login.js',
    '/style.css',
    '/usuario.css',
    '/usuario.html',
    '/usuario.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});