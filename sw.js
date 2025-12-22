// BNS Neo Field Boss Timer - Service Worker
// Provides offline functionality and caching

const CACHE_NAME = "bns-timer-v1.0.0";
const RUNTIME_CACHE = "bns-timer-runtime";

// Determine base path (localhost vs GitHub Pages)
const BASE_PATH =
  self.location.hostname === "localhost" ? "" : "/bns-neo-boss-timer";

// Core files to cache for offline functionality
const CORE_ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/styles.css`,
  `${BASE_PATH}/script.js`,
  `${BASE_PATH}/bosses.json`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/assets/notification.mp3`,
];

// Install event - cache core assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker...");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Caching core assets");
        return cache.addAll(CORE_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error("[SW] Failed to cache core assets:", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Network-first strategy for bosses.json (always get fresh data)
  if (request.url.includes("bosses.json")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the fresh data
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fallback to cached version if offline
          return caches.match(request);
        })
    );
    return;
  }

  // Cache-first strategy for other assets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version
        return cachedResponse;
      }

      // Fetch from network and cache for future
      return fetch(request)
        .then((response) => {
          // Only cache successful responses
          if (
            !response ||
            response.status !== 200 ||
            response.type === "error"
          ) {
            return response;
          }

          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });

          return response;
        })
        .catch((error) => {
          console.error("[SW] Fetch failed:", error);

          // Return offline page or fallback
          if (request.destination === "document") {
            return caches.match("/bns-neo-boss-timer/index.html");
          }
        });
    })
  );
});

// Background sync for notifications (future feature)
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-boss-data") {
    event.waitUntil(
      fetch("/bns-neo-boss-timer/bosses.json")
        .then((response) => response.json())
        .then((data) => {
          console.log("[SW] Boss data synced:", data);
        })
        .catch((error) => {
          console.error("[SW] Sync failed:", error);
        })
    );
  }
});

// Push notifications (future feature)
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "Boss spawning soon!",
    icon: `${BASE_PATH}/assets/icon-192.svg`,
    badge: `${BASE_PATH}/assets/icon-192.svg`,
    vibrate: [200, 100, 200],
    tag: "boss-notification",
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification("🗡️ BNS Field Boss Alert", options)
  );
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window if available
        for (const client of clientList) {
          if (client.url.includes("bns-neo-boss-timer") && "focus" in client) {
            return client.focus();
          }
        }
        // Open new window if none exists
        if (clients.openWindow) {
          return clients.openWindow(`${BASE_PATH}/`);
        }
      })
  );
});
