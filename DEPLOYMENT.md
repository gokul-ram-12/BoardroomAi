# Deployment Guide — BoardroomAI

## Prerequisites

- Node.js 18+
- npm 9+
- A Firebase project (Free Spark plan is sufficient)
- A Vercel account (Free Hobby plan is sufficient)
- A Google AI API key (for Gemini — free via [Google AI Studio](https://aistudio.google.com/apikey))

---

## Firebase Setup

### Step 1 — Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Name it (e.g., `boardroom-ai`)
4. Disable Google Analytics (optional) → Create project

### Step 2 — Enable Authentication

1. In the left sidebar: **Build → Authentication**
2. Click **"Get started"**
3. Enable **Email/Password** provider
4. Enable **Google** provider (add your support email)

### Step 3 — Create Firestore Database

1. In the left sidebar: **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (for development)
4. Select a region close to your users → Enable

### Step 4 — Get Client SDK Config

1. **Project Settings** (gear icon) → **Your apps** tab
2. Click **"Add app"** → Choose **Web** (`</>`)
3. Register app → Copy the Firebase config object

This gives you the `NEXT_PUBLIC_FIREBASE_*` values.

### Step 5 — Generate Admin SDK Service Account

1. **Project Settings** → **Service accounts** tab
2. Click **"Generate new private key"**
3. Download the JSON file
4. Extract: `project_id`, `client_email`, `private_key`

This gives you the `FIREBASE_*` values.

### Step 6 — Deploy Firestore Security Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (choose Firestore)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

Or paste this in the Firebase Console under Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /adk_sessions/{sessionId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Environment Variables

Create `.env.local` in the project root:

```env
# ─────────────────────────────────────────────────────────
# Firebase Client SDK (from Firebase Console → Project Settings → Your apps)
# ─────────────────────────────────────────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef

# ─────────────────────────────────────────────────────────
# Firebase Admin SDK (from Service Account JSON)
# ─────────────────────────────────────────────────────────
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
# ⚠️ Wrap the private key in double quotes and replace literal \n with \\n
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQ...\n-----END PRIVATE KEY-----\n"

# ─────────────────────────────────────────────────────────
# Google AI (Gemini) — Get from https://aistudio.google.com/apikey
# ─────────────────────────────────────────────────────────
GOOGLE_GENAI_API_KEY=AIzaSy...
```

> ⚠️ **FIREBASE_PRIVATE_KEY**: On Vercel, paste the raw value from the JSON file. Vercel handles newline escaping automatically. Locally, replace `\n` with actual newlines inside quotes.

---

## Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Vercel Deployment

### Option A — Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option B — Via GitHub

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Vercel auto-detects Next.js — no configuration needed
5. Set environment variables (see below)
6. Click **Deploy**

### Setting Environment Variables in Vercel

1. Go to your project dashboard on Vercel
2. **Settings** → **Environment Variables**
3. Add each variable from `.env.local`:
   - Set **Environment**: `Production`, `Preview`, `Development`
   - For `FIREBASE_PRIVATE_KEY`: paste the raw value with actual newlines (not `\n`)

---

## Build Verification

```bash
# Ensure zero TypeScript errors
npm run build

# Ensure zero lint errors
npm run lint
```

Expected output:
```
✓ Compiled successfully
✓ Finished TypeScript in Xs
✓ Generating static pages (20/20)
```

---

## Vercel Configuration (next.config.ts)

The project is pre-configured for Vercel deployment. No additional configuration is needed.

---

## Post-Deployment Checklist

- [ ] Landing page loads at `/`
- [ ] Sign in works (Google or email)
- [ ] Dashboard redirects to `/dashboard` after auth
- [ ] `/dashboard/agents` shows agent cards
- [ ] `/dashboard/projects` shows project cards
- [ ] `/dashboard/reports` download buttons work
- [ ] `/api/health` returns `{ "status": "ok" }`

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `FIREBASE_PRIVATE_KEY` error | Ensure newlines are actual `\n` chars, not literal backslash-n |
| Auth redirect loop | Check `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` is correct |
| Firestore permission denied | Deploy Firestore security rules |
| Build fails with TS errors | Run `npm run build` locally first to diagnose |
| Gemini API errors | Verify `GOOGLE_GENAI_API_KEY` is set and quota not exceeded |
