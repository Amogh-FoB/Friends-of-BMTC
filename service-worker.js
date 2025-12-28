self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("fobmtc-v1").then(cache =>
      cache.addAll([
        "/",
        "/index.html",
        "/timetable.html",
        "/about.html",
        "/contact.html",
        "/css/style.css",
        "/js/timetable.js",
        "/data/timetables.json"
      ])
    )
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
