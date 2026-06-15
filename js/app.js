// app.js - wires everything together + screen routing + error handling.
(function () {
  var allMedia = [], viewMedia = [];
  function show(id) { ["screen-login", "screen-connect", "screen-gallery"].forEach(function (s) { document.getElementById(s).classList.toggle("hidden", s !== id); }); }
  function hideBoot() { document.getElementById("boot").classList.add("hidden"); }
  function err(id, msg) { var e = document.getElementById(id); if (e) e.textContent = msg || ""; }
  function refresh() {
    var type = document.getElementById("type-filter").value, date = document.getElementById("search").value;
    viewMedia = CSMFilters.apply(allMedia, type, date);
    CSMGallery.render(viewMedia, function (i) { CSMLightbox.open(viewMedia, i); });
  }
  function loadFromStore() { allMedia = CSMStore.load(); refresh(); }
  function status(msg) {
    var s = document.getElementById("upload-status");
    if (!msg) { s.classList.add("hidden"); s.textContent = ""; return; }
    s.classList.remove("hidden"); s.textContent = msg;
  }
  function runPickerFlow() {
    err("connect-error", ""); var token;
    status("// requesting Google access...");
    return CSMGoogle.getToken(false)
      .then(function (t) { token = t; status("// opening Google Photos picker..."); return CSMPicker.createSession(token); })
      .then(function (session) {
        window.open(session.pickerUri, "_blank");
        status("// waiting for you to finish picking in Google Photos...");
        return CSMPicker.pollSession(token, session.id, null).then(function () { return session.id; });
      })
      .then(function (sessionId) {
        status("// reading your selection...");
        return CSMPicker.listMediaItems(token, sessionId).then(function (items) {
          return uploadAll(items, token).then(function () { CSMPicker.deleteSession(token, sessionId); });
        });
      })
      .then(function () { status(""); show("screen-gallery"); refresh(); })
      .catch(function (e) {
        console.error(e); status("");
        var msg = /Google Identity/.test(e.message) ? "Google not ready, try again in a second." : e.message;
        err("connect-error", "Error: " + msg);
      });
  }
  function uploadAll(items, token) {
    if (!items.length) { status("// nothing selected"); return Promise.resolve(); }
    var done = 0;
    return items.reduce(function (chain, item) {
      return chain.then(function () {
        status("// uploading " + (done + 1) + " / " + items.length + " to Cloudinary...");
        return CSMCloudinary.uploadItem(item, token).then(function (rec) { allMedia = CSMStore.add(rec); done++; })
          .catch(function (e) { console.warn("Skipped one item:", e.message); done++; });
      });
    }, Promise.resolve());
  }
  function netStatus() {
    var on = navigator.onLine, el = document.getElementById("net-status");
    if (el) { el.textContent = on ? "online" : "offline"; el.className = "net " + (on ? "online" : "offline"); }
    var add = document.getElementById("add-more-btn"); if (add) add.disabled = !on;
  }
  function bind() {
    document.getElementById("login-form").addEventListener("submit", function (e) {
      e.preventDefault(); err("login-error", "");
      var btn = document.getElementById("login-btn"); btn.disabled = true; btn.textContent = "> authenticating...";
      CSMAuth.signIn(document.getElementById("email").value, document.getElementById("password").value)
        .catch(function (e) { err("login-error", CSMAuth.friendly(e)); })
        .finally(function () { btn.disabled = false; btn.textContent = "> sign in"; });
    });
    document.getElementById("google-btn").addEventListener("click", function () {
      CSMGoogle.getToken(true).then(function () { err("connect-error", "// access granted. click 'Select photos'."); })
        .catch(function (e) { err("connect-error", "Error: " + e.message); });
    });
    document.getElementById("open-picker-btn").addEventListener("click", runPickerFlow);
    document.getElementById("add-more-btn").addEventListener("click", function () { show("screen-connect"); runPickerFlow(); });
    ["logout-btn", "logout-btn-2"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener("click", function () { CSMGoogle.clear(); CSMAuth.signOut(); });
    });
    document.getElementById("search").addEventListener("input", refresh);
    document.getElementById("type-filter").addEventListener("change", refresh);
    window.addEventListener("online", netStatus); window.addEventListener("offline", netStatus);
    CSMLightbox.bind();
  }
  function start() {
    bind(); netStatus(); loadFromStore();
    CSMAuth.onAuthChanged(function (user) {
      hideBoot();
      if (user) { if (allMedia.length) { show("screen-gallery"); refresh(); } else show("screen-connect"); }
      else show("screen-login");
    });
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function (e) { console.warn("SW failed:", e); }); });
    }
  }
  document.addEventListener("DOMContentLoaded", start);
})();
