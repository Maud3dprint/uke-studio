const C = "uke-studio-v7-final-split";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(C).then(c => c.addAll([
    "./",
    "./index.html",
    "./manifest.json",
    "./vendor-react.js",
    "./data-chords.js",
    "./data-songs.js",
    "./app/bootstrap.js",
    "./app/theme.js",
    "./app/db.js",
    "./app/engines-align.js",
    "./app/engines-audio.js",
    "./app/engines-import.js",
    "./app/screens/library.js",
    "./app/screens/player.js",
    "./app/screens/import-mp3.js",
    "./app/screens/karaoke.js",
    "./app/screens/home.js",
    "./app/screens/transfer.js",
    "./app/screens/studio-patreon.js",
    "./app/screens/recordings.js",
    "./app/screens/import-voice.js",
    "./app/screens/import-image-pdf.js",
    "./app/screens/strumming.js",
    "./app/screens/request-song.js",
    "./app/screens/tuner.js",
    "./app/screens/editor.js",
    "./app/screens/chord-diagram.js",
    "./app/main.js"
])));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))));
  self.clients.claim();
});
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  let sameOrigin = false;
  try { sameOrigin = new URL(e.request.url).origin === self.location.origin; } catch {}
  e.respondWith(
    withTimeout(fetch(e.request), 3500).then(r => {
      if (sameOrigin && r && r.ok) { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); }
      return r;
    }).catch(() => caches.match(e.request).then(m => m || fetch(e.request)))
  );
});
