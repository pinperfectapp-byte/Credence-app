// CHIDONIQ Service Worker - Clean Passthrough & Self-Healing Cache Cleanup
// Ensures no stale caches interfere with dev or preview dashboard loading.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => {
      return self.registration.unregister();
    })
  );
});

// No fetch interception to prevent stale cache locking
