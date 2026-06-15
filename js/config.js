// ============================================================================
// CSM Drive - Configuration
// ----------------------------------------------------------------------------
// Fill in all the values below. See SETUP.md for step-by-step instructions.
// This file is the ONLY place you should need to edit to run the project.
// ============================================================================

window.CSM_CONFIG = {
  // --- Firebase (email/password auth) -------------------------------------
  firebase: {
    apiKey: "AIzaSyBtmUmV1KxQDB0jN9gUQnh-eYWKllMPav0",
    authDomain: "photos-58c8e.firebaseapp.com",
    projectId: "photos-58c8e",
    appId: "1:1014680212942:web:2319c936cdcac09dcac79f"
  },

  // --- Google OAuth (for Google Photos Picker) ----------------------------
  google: {
    clientId: "19182966942-vglvbunbkmg4ssj2fmp4fsqln30as7ln.apps.googleusercontent.com",
    scope: "https://www.googleapis.com/auth/photospicker.mediaitems.readonly"
  },

  // --- Cloudinary (unsigned upload) ---------------------------------------
  cloudinary: {
    cloudName: "dx7aankx2",
    uploadPreset: "github_unsigned",
    folder: "csm-drive"
  }
};
