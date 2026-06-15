// sw.js - Service Worker for offline support.
var SHELL_CACHE = "csm-shell-v1", MEDIA_CACHE = "csm-media-v1";
var SHELL = ["./","./index.html","./css/style.css","./js/config.js","./js/store.js","./js/firebase-auth.js","./js/google-auth.js","./js/picker.js","./js/cloudinary.js","./js/gallery.js","./js/lightbox.js","./js/filters.js","./js/app.js","./manifest.webmanifest"];
self.addEventListener("install", function (e) { self.skipWaiting(); e.waitUntil(caches.open(SHELL_CACHE).then(function (c) { return c.addAll(SHELL); }).catch(function () {})); });
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.map(function (k) { if (k !== SHELL_CACHE && k !== MEDIA_CACHE) return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var req = e.request; if (req.method !== "GET") return; var url = new URL(req.url);
  if (/googleapis\.com|google\.com|gstatic\.com|firebase|identitytoolkit|api\.cloudinary\.com/.test(url.host + url.pathname)) return;
  if (/res\.cloudinary\.com/.test(url.host)) {
    e.respondWith(caches.open(MEDIA_CACHE).then(function (cache) {
      return cache.match(req).then(function (hit) {
        if (hit) return hit;
        return fetch(req).then(function (resp) { if (resp.ok) cache.put(req, resp.clone()); return resp; });
      });
    }));
    return;
  }
  e.respondWith(caches.match(req).then(function (hit) {
    var net = fetch(req).then(function (resp) {
      if (resp.ok && url.origin === self.location.origin) caches.open(SHELL_CACHE).then(function (c) { c.put(req, resp.clone()); });
      return resp;
    }).catch(function () { return hit; });
    return hit || net;
  }));
});
