/* The Divine Quest — production service worker.
 *
 * The built site (dist/) is deployed to the site root, so precache URLs are
 * root-relative. Every entry is added individually with a catch so a missing
 * optional file (e.g. in dev, where the un-bundled sources are served) never
 * fails the whole install.
 */
const CACHE_VERSION = 'v4';
const CACHE_NAME = `divine-quest-${CACHE_VERSION}`;
const OFFLINE_URL = './offline.html';

const PRECACHE_URLS = [
  './',
  './index.html',
  './offline.html',
  './manifest.webmanifest',
  './bundle.js',
  './styles.css',
  './ascension.css',
  './assets/vendor/tailwind.min.css',
  './assets/vendor/fontawesome/css/all.min.css',
  './assets/vendor/fonts/fonts.css'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return Promise.all(
        PRECACHE_URLS.map(function (url) {
          return cache.add(url).catch(function () {
            // Ignore individual prefetch failures (optional assets / dev layout).
          });
        })
      ).then(function () {
        return self.skipWaiting();
      });
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (key) { return key !== CACHE_NAME; })
            .map(function (key) { return caches.delete(key); })
        );
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var request = event.request;
  if (request.method !== 'GET') return;

  // Never intercept non-http(s) schemes retrievable by the SW.
  var parsed = new URL(request.url);
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return;

  // Let range/media requests and cross-origin go straight to network (but
  // still cache successful same-origin responses).
  if (request.mode === 'navigate') {
    // Navigation: network-first with precached/offline fallback so the
    // player always can reach the game.
    event.respondWith(
      fetch(request).then(function (response) {
        if (response && response.status === 200 && response.type === 'basic') {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put('./index.html', clone);
          });
        }
        return response;
      }).catch(function () {
        return caches.match('./index.html').then(function (cached) {
          return cached || caches.match(OFFLINE_URL);
        });
      })
    );
    return;
  }

  // Assets: stale-while-revalidate for speed + freshness.
  event.respondWith(
    caches.match(request).then(function (cached) {
      var network = fetch(request).then(function (response) {
        if (response && response.status === 200 && response.type === 'basic') {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(request, clone);
          });
        }
        return response;
      }).catch(function () {
        if (cached) return cached;
        if (request.headers.get('accept') && request.headers.get('accept').indexOf('text/html') !== -1) {
          return caches.match(OFFLINE_URL);
        }
      });
      return cached || network;
    })
  );
});