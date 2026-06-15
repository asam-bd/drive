// google-auth.js - Google OAuth token via Google Identity Services.
(function () {
  var cfg = window.CSM_CONFIG.google;
  var TOKEN_KEY = "csm_g_token", EXP_KEY = "csm_g_token_exp", tokenClient = null;
  function initClient() {
    if (tokenClient || !window.google || !google.accounts) return tokenClient;
    tokenClient = google.accounts.oauth2.initTokenClient({ client_id: cfg.clientId, scope: cfg.scope, callback: function () {} });
    return tokenClient;
  }
  function storedToken() {
    var t = sessionStorage.getItem(TOKEN_KEY), exp = parseInt(sessionStorage.getItem(EXP_KEY) || "0", 10);
    if (t && Date.now() < exp - 60000) return t;
    return null;
  }
  function getToken(forcePrompt) {
    return new Promise(function (resolve, reject) {
      var existing = storedToken();
      if (existing && !forcePrompt) return resolve(existing);
      var client = initClient();
      if (!client) return reject(new Error("Google Identity Services not loaded yet."));
      client.callback = function (resp) {
        if (resp.error) return reject(new Error(resp.error));
        sessionStorage.setItem(TOKEN_KEY, resp.access_token);
        var expiresMs = (resp.expires_in ? resp.expires_in : 3600) * 1000;
        sessionStorage.setItem(EXP_KEY, String(Date.now() + expiresMs));
        resolve(resp.access_token);
      };
      client.requestAccessToken({ prompt: forcePrompt ? "consent" : "" });
    });
  }
  function clear() { sessionStorage.removeItem(TOKEN_KEY); sessionStorage.removeItem(EXP_KEY); }
  window.CSMGoogle = { getToken: getToken, clear: clear };
})();
