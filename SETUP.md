# CSM Drive - Setup Guide

You only need to edit **`js/config.js`**. Below is how to get each value.

## 0. Your site URL
After the first successful pipeline, your GitLab Pages URL appears under **Deploy -> Pages**:
```
https://csm.mohasin-group.gitlab.io/csm-drive/
```
Use it as the authorized origin/domain below.

## 1. Firebase (email/password login)
1. https://console.firebase.google.com -> **Add project**.
2. **Authentication -> Get started -> Sign-in method** -> enable **Email/Password**.
3. **Authentication -> Users -> Add user** (the account YOU log in with).
4. **Authentication -> Settings -> Authorized domains** -> add `csm.mohasin-group.gitlab.io`.
5. **Project settings -> Your apps -> Web app (</>)** -> copy values into `js/config.js`.

## 2. Google OAuth + Photos Picker API
1. https://console.cloud.google.com -> create/select a project.
2. **APIs & Services -> Library** -> enable **Google Photos Picker API**.
3. **OAuth consent screen**: External; add scope `.../auth/photospicker.mediaitems.readonly`; add your email under **Test users**.
4. **Credentials -> Create credentials -> OAuth client ID -> Web application**:
   - **Authorized JavaScript origins**: `https://csm.mohasin-group.gitlab.io` (origin only, no path).
   - Copy the **Client ID** into `js/config.js`.

> No client secret is used (public static app).

## 3. Cloudinary (unsigned upload)
1. Sign up at https://cloudinary.com.
2. Note your **Cloud name** from the dashboard.
3. **Settings -> Upload -> Upload presets -> Add upload preset**: Signing Mode **Unsigned**; folder `csm-drive`.
4. Put `cloudName` and `uploadPreset` into `js/config.js`.

## 4. Run
1. Commit your edited `js/config.js`.
2. Push to `main` -> the **pages** pipeline deploys automatically.
3. Open your Pages URL, log in, **Continue with Google**, **Select photos**, pick media -> uploaded to Cloudinary.
4. Later visits load from Cloudinary; previously viewed media is available **offline**.

## Troubleshooting
- **Popup blocked**: allow popups for your Pages domain.
- **origin mismatch**: JS origin in Google Credentials must match your Pages origin exactly.
- **Firebase `auth/unauthorized-domain`**: add your domain in Firebase Authorized domains.
- **Cloudinary 400/401**: ensure preset is **Unsigned** and names match.
