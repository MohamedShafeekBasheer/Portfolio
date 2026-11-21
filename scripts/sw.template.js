/* Service worker — generated at build time by scripts/prerender.mjs.
 *
 * Pages:  network first (3.5 s timeout), fall back to the cached copy, then to the home page.
 *         So visitors always get the latest deploy when online, and the site still opens offline.
 * Assets: /assets/* files have content hashes in their names, so they're served from cache forever.
 * Old caches (including the previous site's) are deleted on activate.
 */
const VERSION = "__VERSION__";
const BASE = __BASE__;
const CACHE = "ms-" + VERSION;
const PRECACHE = __PRECACHE__;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((c) => Promise.all(PRECACHE.map((u) => c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    const net = fetch(req).then((res) => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
      }
      return res;
    });
    event.respondWith(
      Promise.race([net, timeout(3500)]).catch(async () => {
        // Slow or offline: use the cached copy of this page if we have one…
        const hit = await caches.match(req, { ignoreSearch: true });
        if (hit) return hit;
        // …otherwise keep waiting for the network, and only then give up.
        try { return await net; } catch {
          return (await caches.match(BASE)) ||
            new Response("<h1>Offline</h1><p>Please check your connection.</p>", { headers: { "Content-Type": "text/html" } });
        }
      })
    );
    return;
  }

  if (!url.pathname.startsWith(BASE)) return;
  if (url.pathname.startsWith(BASE + "assets/") || url.pathname.startsWith(BASE + "img/")) {
    event.respondWith(
      caches.match(req).then((hit) =>
        hit || fetch(req).then((res) => {
          if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
          return res;
        })
      )
    );
  }
});
