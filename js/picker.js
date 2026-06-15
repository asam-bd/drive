// picker.js - Google Photos Picker API session.
(function () {
  var BASE = "https://photospicker.googleapis.com/v1";
  function authHeaders(token) { return { "Authorization": "Bearer " + token, "Content-Type": "application/json" }; }
  function createSession(token) { return fetch(BASE + "/sessions", { method: "POST", headers: authHeaders(token), body: "{}" }).then(handle); }
  function pollSession(token, sessionId, onTick) {
    return new Promise(function (resolve, reject) {
      var tries = 0;
      (function loop() {
        fetch(BASE + "/sessions/" + sessionId, { headers: authHeaders(token) }).then(handle).then(function (s) {
          if (s.mediaItemsSet) return resolve(s);
          tries++; if (tries > 600) return reject(new Error("Picker timed out."));
          if (onTick) onTick(tries);
          var waitMs = (s.pollingConfig && s.pollingConfig.pollInterval) ? parseInterval(s.pollingConfig.pollInterval) : 2500;
          setTimeout(loop, waitMs);
        }).catch(reject);
      })();
    });
  }
  function listMediaItems(token, sessionId) {
    var items = [];
    function page(pageToken) {
      var url = BASE + "/mediaItems?sessionId=" + encodeURIComponent(sessionId) + "&pageSize=100";
      if (pageToken) url += "&pageToken=" + encodeURIComponent(pageToken);
      return fetch(url, { headers: authHeaders(token) }).then(handle).then(function (res) {
        (res.mediaItems || []).forEach(function (m) { items.push(m); });
        if (res.nextPageToken) return page(res.nextPageToken);
        return items;
      });
    }
    return page(null);
  }
  function deleteSession(token, sessionId) { return fetch(BASE + "/sessions/" + sessionId, { method: "DELETE", headers: authHeaders(token) }).catch(function () {}); }
  function handle(r) { if (!r.ok) return r.text().then(function (t) { throw new Error("Picker API " + r.status + ": " + t); }); return r.json(); }
  function parseInterval(s) { var n = parseFloat(String(s).replace("s", "")); return isNaN(n) ? 2500 : Math.max(1000, n * 1000); }
  window.CSMPicker = { createSession: createSession, pollSession: pollSession, listMediaItems: listMediaItems, deleteSession: deleteSession };
})();
