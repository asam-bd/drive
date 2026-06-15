// ============================================================================
// CSM Drive - Configuration
// ----------------------------------------------------------------------------
// Fill in all the values below. See SETUP.md for step-by-step instructions.
// This file is the ONLY place you should need to edit to run the project.
// ============================================================================

window.CSM_CONFIG = {
  // --- Firebase (email/password auth) -------------------------------------
  firebase: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    appId: "YOUR_FIREBASE_APP_ID"
  },

  // --- Google OAuth (for Google Photos Picker) ----------------------------
  google: {
    clientId: "YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com",
    scope: "https://www.googleapis.com/auth/photospicker.mediaitems.readonly"
  },

  // --- Cloudinary (unsigned upload) ---------------------------------------
  cloudinary: {
    cloudName: "YOUR_CLOUDINARY_CLOUD_NAME",
    uploadPreset: "YOUR_UNSIGNED_UPLOAD_PRESET",
    folder: "csm-drive"
  }
};
