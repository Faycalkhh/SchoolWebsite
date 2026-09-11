const CACHE = "nur-alquran-v3";

const PRECACHE = ["/", "/login", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);

  // Skip non-GET and API / Supabase calls — always go to network
  if (e.request.method !== "GET") return;
  if (url.pathname.startsWith("/api/") || url.hostname.includes("supabase")) return;

  // HTML documents and build assets must be network-first. A cached shell from a
  // previous deploy references /_next/ chunks that no longer exist on the server,
  // so the page renders but never hydrates and the buttons do nothing.
  if (e.request.mode === "navigate" || url.pathname.startsWith("/_next/")) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => caches.match(e.request).then((c) => c ?? Response.error()))
    );
    return;
  }

  // Cache-first is fine for images, icons and fonts, which are content-addressed
  // or change rarely. Refresh them in the background.
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fresh = fetch(e.request).then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      });
      return cached ?? fresh;
    })
  );
});
