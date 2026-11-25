# 🧳 Wandering Baski

A travel tracker for you and your crew — see who's away, when, and where.

## Features

- **Who's Away** — live status card showing travelers away right now
- **Trip list** — upcoming and past trips with delete (your own only)
- **Calendar view** — month grid with color-coded dots per traveler
- **Map view** — Leaflet map showing geocoded trip locations
- **Calendar sync** — subscribe in Google Calendar or download .ics
- **DANGER banner** — animated alert when everyone's away at once
- **Firebase Auth** — email/password sign-in with display names

---

## Setup

### 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication → Email/Password**
4. Enable **Firestore Database** (start in test mode, then apply the rules below)

### 2. Get your Firebase config

In Firebase Console → Project Settings → Your apps → Add web app.  
Copy the config object values.

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` with your Firebase values:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 4. Apply Firestore security rules

In Firebase Console → Firestore → Rules, paste the contents of `firestore.rules`.

### 5. Install and run

```bash
npm install
npm run dev
```

---

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add your `VITE_FIREBASE_*` environment variables in the Vercel dashboard under  
**Project → Settings → Environment Variables**.

For the live calendar feed (`/api/calendar.ics`), also add these  
**server-side** variables (from your Firebase service account JSON):

```
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
```

Generate a service account key in Firebase Console →  
Project Settings → Service Accounts → Generate new private key.

---

## Add a hero photo

Open `src/components/HeroPhoto.jsx` and follow the instructions at the top of the file.  
Drop your photo into `src/assets/`, import it, and add it to the `PHOTOS` array.  
You can add multiple photos — the app picks one randomly each page load.

---

## Customizing the app name

The app name "Wandering Baski" appears in:
- `index.html` — `<title>` and favicon text
- `src/pages/Login.jsx` — login screen header
- `src/pages/Dashboard.jsx` — main header
- `src/lib/ics.js` — calendar PRODID and UID suffix
- `api/calendar.ics.js` — server-side calendar name

---

## Tech stack

- React 18 + Vite
- Firebase Auth + Firestore
- Leaflet + react-leaflet v4 (map)
- Nominatim (geocoding, via OpenStreetMap)
- Vercel (hosting + serverless functions)
