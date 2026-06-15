# CSM Drive

A modern, secure, **fully static** photo gallery web app.

Sign in with **Firebase email/password**, connect **Google Photos**, pick your important photos/videos, and they are uploaded to **Cloudinary**. On every later visit the gallery loads straight from Cloudinary, and a **Service Worker (`sw.js`)** lets you view cached photos **offline**.

No backend server. Deployed on **GitLab Pages**.

## Flow

1. Open site -> Firebase email/password login (gate / protection).
2. `Continue with Google` -> grant Google Photos access.
3. Google Photos **Picker** opens (shows only Google Photos library, not device photos).
4. Select important photos/videos -> auto uploaded to Cloudinary.
5. Second visit -> everything loads from Cloudinary automatically.
6. Offline -> photos viewable via Service Worker cache.

## Quick start

1. Read **[SETUP.md](SETUP.md)** and fill your credentials in `js/config.js`.
2. Push to `main` -> GitLab CI deploys to GitLab Pages automatically.
3. Open your Pages URL and log in.

## Security notes

- Firebase `apiKey` in frontend is normal; real protection is **Authorized domains** + **Security Rules**.
- Cloudinary **unsigned** preset lets anyone who knows the preset name upload, but **not read** your photos. Fine for personal use.
