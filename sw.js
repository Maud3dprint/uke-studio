const C = "uke-studio-v5-step1";

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(C).then(c => c.addAll([
      "./",
      "./index.html",
      "./vendor-react.js",
      "./app-bundle.js",
      "./manifest.json"
    ]))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(ks =>
      Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Réseau d'abord (versions toujours fraîches) MAIS avec un délai maximal :
// si GitHub est lent ou en plein déploiement, la copie locale démarre aussitôt.
const withTimeout = (p, ms) => Promise.race([
  p,
  new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))
]);

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;

  let sameOrigin = false;
  try {
    sameOrigin = new URL(e.request.url).origin === self.location.origin;
  } catch {}

  e.respondWith(
    withTimeout(fetch(e.request), 3500)
      .then(r => {
        if (sameOrigin && r && r.ok) {
          const cp = r.clone();
          caches.open(C).then(c => c.put(e.request, cp));
        }
        return r;
      })
      .catch(() => caches.match(e.request).then(m => m || fetch(e.request)))
  );
});
