// firebase-auth.js - email/password gate.
(function () {
  var cfg = window.CSM_CONFIG.firebase;
  var ready = false;
  try { firebase.initializeApp({ apiKey: cfg.apiKey, authDomain: cfg.authDomain, projectId: cfg.projectId, appId: cfg.appId }); ready = true; }
  catch (e) { console.error("Firebase init failed:", e); }
  function onAuthChanged(cb) { if (!ready) return cb(null); firebase.auth().onAuthStateChanged(cb); }
  function signIn(email, password) { return firebase.auth().signInWithEmailAndPassword(email, password); }
  function signOut() { return firebase.auth().signOut(); }
  function friendly(err) {
    if (!err || !err.code) return "Something went wrong. Try again.";
    switch (err.code) {
      case "auth/invalid-email": return "Invalid email address.";
      case "auth/user-not-found": case "auth/wrong-password": case "auth/invalid-credential": return "Wrong email or password.";
      case "auth/too-many-requests": return "Too many attempts. Wait a bit.";
      case "auth/network-request-failed": return "Network error. Check your connection.";
      default: return err.message || "Authentication failed.";
    }
  }
  window.CSMAuth = { onAuthChanged: onAuthChanged, signIn: signIn, signOut: signOut, friendly: friendly };
})();
