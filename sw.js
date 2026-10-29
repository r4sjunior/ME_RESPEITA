// Service worker: casca do app em cache (rede primeiro) e mídia em cache sob demanda.
// Ao mudar index/styles/app/data, troque a versão para forçar a atualização.
const VERSAO = "me-respeita-v4";
const CASCA = ["/", "/styles.css", "/app.js", "/data.js", "/manifest.webmanifest", "/img/hero.webp", "/img/icone-192.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSAO).then((c) => c.addAll(CASCA)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== VERSAO).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || req.headers.has("range")) return;
  const url = new URL(req.url);
  const midia = url.pathname.startsWith("/img/") || url.hostname.endsWith("gstatic.com") || url.hostname === "fonts.googleapis.com";

  if (midia) {
    // cache primeiro: imagens e fontes não mudam entre versões
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok || res.type === "opaque") {
          const copia = res.clone();
          caches.open(VERSAO).then((c) => c.put(req, copia));
        }
        return res;
      }))
    );
  } else if (url.origin === location.origin && !url.pathname.startsWith("/video/")) {
    // rede primeiro: o app sempre pega a versão nova quando há conexão
    e.respondWith(
      fetch(req).then((res) => {
        const copia = res.clone();
        caches.open(VERSAO).then((c) => c.put(req, copia));
        return res;
      }).catch(() => caches.match(req).then((hit) => hit || caches.match("/")))
    );
  }
});
