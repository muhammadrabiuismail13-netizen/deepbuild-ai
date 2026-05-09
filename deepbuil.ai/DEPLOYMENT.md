# DeepBuild.ai — Production Launch Guide

A complete, executable step-by-step guide to take this codebase from local
development to a live, real-product launch on **deepbuild.ai**.

> Stack: **React + Vite + Tailwind** (frontend) · **Node.js + Express + MongoDB**
> (backend) · **Cloudinary** (video/image hosting) · **Vercel** (frontend) ·
> **Render** (backend) · **MongoDB Atlas** (database) · **Cloudflare/Namecheap** (DNS).

---

## 1. PROJECT STRUCTURE & CLEANUP

After this guide, your repo should look like this:

```
deepbuild.ai/
├── public/                  # Static frontend assets
│   └── images/              # Hero + module thumbnails
├── src/                     # Frontend (React + Vite)
│   ├── components/          # Reusable UI: Hero, ModuleCard, BottomNav, …
│   ├── pages/               # Routes: Home, Courses, Watch, Admin, Login, Signup
│   ├── store/               # AuthContext, CoursesContext
│   ├── lib/                 # api.ts (fetch wrapper, uploadFile)
│   ├── data/                # Seed/demo data
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server/                  # Backend (Node + Express + MongoDB)
│   ├── src/
│   │   ├── config/          # db.js, cloudinary.js
│   │   ├── models/          # User.js, Course.js
│   │   ├── routes/          # auth.js, courses.js, uploads.js
│   │   ├── middleware/      # auth.js, upload.js, error.js
│   │   ├── scripts/         # seed.js (creates first admin)
│   │   └── index.js         # Express entry
│   ├── .env.example
│   ├── .gitignore
│   └── package.json
├── .env.example             # Frontend env (VITE_API_URL)
├── DEPLOYMENT.md            # This file
├── package.json             # Frontend deps
├── vite.config.ts
└── index.html
```

### One-time cleanup before deploying

The current `vite.config.ts` uses `vite-plugin-singlefile`, which inlines
everything into one HTML (great for previews, **bad for production** —
it disables code-splitting and asset caching). Before deploying to Vercel:

```bash
# Remove the single-file plugin
npm uninstall vite-plugin-singlefile
```

Then edit `vite.config.ts` and remove the `viteSingleFile()` plugin from the
`plugins` array. Vercel will then serve real assets with proper caching.

---

## 2. LOCAL SETUP

### 2.1 Prerequisites

```bash
node --version    # >= 18
npm --version     # >= 9
git --version
```

If you don't have Node 18+: install via [nvm](https://github.com/nvm-sh/nvm).

### 2.2 Clone & install

```bash
git clone https://github.com/<you>/deepbuild.ai.git
cd deepbuild.ai

# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 2.3 Configure env files

```bash
# Frontend
cp .env.example .env.local
# leave VITE_API_URL=http://localhost:5000/api

# Backend
cp server/.env.example server/.env
# fill in values (see DATABASE + Cloudinary sections below)
```

### 2.4 Run both servers

Open two terminals:

```bash
# Terminal 1 — backend on :5000
cd server
npm run dev

# Terminal 2 — frontend on :5173
npm run dev
```

Visit **http://localhost:5173**. The frontend will hit
`http://localhost:5000/api`. If the backend is down, the home page still
renders demo seed data.

### 2.5 Common errors & fixes

| Error | Fix |
| --- | --- |
| `MongoServerError: bad auth` | Wrong Atlas user/pass in `MONGO_URI`. URL-encode special characters. |
| `CORS blocked: http://localhost:5173` | Add `http://localhost:5173` to `CLIENT_ORIGIN` in `server/.env`. |
| `EADDRINUSE :::5000` | `lsof -i :5000` → `kill -9 <PID>`, or change `PORT`. |
| Frontend stuck on "demo data" | Backend not running. Start it, then refresh. |
| `Invalid token` after redeploy | You changed `JWT_SECRET`. Sign out and sign in again. |

---

## 3. DATABASE SETUP (MongoDB)

We use **MongoDB** because the data (courses with embedded lessons) is
naturally document-shaped and Atlas's free tier is plenty for launch.

### 3.1 Create a free Atlas cluster

1. Go to <https://www.mongodb.com/cloud/atlas/register>.
2. Create a project → **Build a Database** → **M0 Free** → pick a region near
   your users → **Create**.
3. **Database Access** → Add user → username `deepbuild`, generate a strong
   password, role **Read and write to any database**. Save the password.
4. **Network Access** → Add IP → **0.0.0.0/0** (allow from anywhere — required
   so Render can reach it; you'll lock this down later).
5. **Database** → **Connect** → **Drivers** → copy the connection string:

```
mongodb+srv://deepbuild:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

Insert the password and append the database name `/deepbuild`:

```
mongodb+srv://deepbuild:YOUR_PASS@cluster0.xxxxx.mongodb.net/deepbuild?retryWrites=true&w=majority
```

Put this in `server/.env` as `MONGO_URI`.

### 3.2 Schemas (already implemented)

**`server/src/models/User.js`**
- `name`, `email` (unique, indexed), `password` (bcrypt-hashed, never returned)
- `role`: `"student"` (default) or `"admin"`
- `progress[]`: per-course lesson completion tracking
- Methods: `comparePassword()`, `toSafeJSON()`

**`server/src/models/Course.js`** (lessons embedded)
- Top: `slug` (unique), `title`, `description`, `category`, `level`,
  `duration`, `thumbnailUrl`, `thumbnailPublicId`, `instructor`,
  `publishedBy`, `isPublished`
- `lessons[]`: `{ title, duration, videoUrl, videoPublicId, order }`
- Text index on `title + description + category` for search

### 3.3 Seed your first admin

```bash
cd server
npm run seed
```

This reads `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` from `.env` and
either creates that user as admin, or promotes the existing user to admin.

Now log in at <http://localhost:5173/#/login> with that email/password and
you'll see the **Admin** button.

---

## 4. VIDEO UPLOAD SYSTEM (Cloudinary)

We use **Cloudinary** instead of self-hosted storage because:
- Free tier (25 GB storage + 25 GB bandwidth/month) is enough for launch
- Auto-transcodes video, generates HLS/DASH adaptive streams
- Global CDN — videos play fast on mobile worldwide
- No server bandwidth cost on Render

### 4.1 Get Cloudinary credentials

1. Sign up free: <https://cloudinary.com/users/register/free>
2. Dashboard → copy **Cloud name**, **API Key**, **API Secret**
3. Paste into `server/.env`:

```env
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx
```

### 4.2 Upload flow (already wired)

```
Admin Dashboard (browser)
        │  multipart POST  (with JWT)
        ▼
POST /api/uploads/video         (server/src/routes/uploads.js)
        │  multer-storage-cloudinary
        ▼
Cloudinary  →  returns secure CDN URL + publicId
        ▼
Frontend stores URL+publicId on the lesson draft
        ▼
POST /api/courses               (creates Course doc with lesson URLs)
        ▼
MongoDB
```

The Admin page (`src/pages/AdminPage.tsx`) already:
- Uploads each video via `uploadFile("/uploads/video", file, onProgress)`
- Shows a **live progress bar** for each lesson while uploading
- Disables Publish until every video has finished uploading
- On success, persists the course via `addModule()` → `POST /api/courses`

### 4.3 Streaming on the frontend

The Watch page uses a native `<video>` element with the Cloudinary URL.
Cloudinary serves byte-range requests, so seeking works. For large
audiences, switch to **adaptive streaming** by appending Cloudinary
delivery params:

```ts
// e.g. transform a base mp4 URL into an HLS playlist
const hlsUrl = videoUrl.replace("/upload/", "/upload/sp_auto/").replace(/\.\w+$/, ".m3u8");
```

Then use [`hls.js`](https://github.com/video-dev/hls.js) for browsers that
don't natively support HLS (everything except Safari).

### 4.4 Quotas & limits

- Video file limit: **500 MB** (set in `server/src/middleware/upload.js`).
- Image (thumbnail) limit: **10 MB**, auto-cropped to **1280×720**.
- Increase `limits.fileSize` if you record high-bitrate lectures.

---

## 5. AUTHENTICATION (JWT)

### 5.1 What's implemented

- `POST /api/auth/signup` → `{ user, token }`
- `POST /api/auth/login` → `{ user, token }`
- `GET  /api/auth/me`    → returns current user (Bearer token)
- Passwords: **bcrypt @ cost 12**
- Tokens: **JWT**, 7-day expiry, signed with `JWT_SECRET`
- Frontend stores token in `localStorage` under `deepbuild.token`
- Auto-restores session on page reload via `/auth/me`

### 5.2 Generate a strong JWT secret

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Paste the output as `JWT_SECRET` in `server/.env` (and later in Render env
vars). **Never commit this.**

### 5.3 Protected routes

**Backend:**
```js
router.post("/", requireAuth, requireAdmin, createCourse);
```

**Frontend:**
```tsx
<Route path="/admin" element={
  <ProtectedRoute adminOnly>
    <AdminPage />
  </ProtectedRoute>
} />
```

Unauthenticated users hitting `/watch/:id` or `/admin` are redirected to
`/login`, then bounced back to the original page after sign-in.

### 5.4 Promoting a user to admin manually

```bash
# In Atlas → Browse Collections → users → edit doc:
{ "role": "admin" }
```
Or rerun `npm run seed` after changing `ADMIN_EMAIL` in `server/.env`.

---

## 6. FRONTEND ↔ BACKEND CONNECTION

### 6.1 The API client

`src/lib/api.ts` exports:
- `api(path, opts)` — JSON fetch wrapper, auto-attaches Bearer token
- `uploadFile(path, file, onProgress)` — multipart upload with progress events
- `tokenStore` — get/set/clear the JWT in `localStorage`
- `ApiError` — typed errors with `.status`

### 6.2 Loading + error UX

Already implemented:
- `<ProtectedRoute>` shows a spinner while restoring session
- `CoursesContext` exposes `{ loading, error, refresh }`
- `AdminPage` shows toast on success, red banner on failure, per-lesson
  progress bars during upload
- `LoginPage`/`SignupPage` show inline error messages from the API

### 6.3 Mobile responsiveness

- **Mobile-first Tailwind**: every page uses fluid widths, `max-w-3xl`
  centered container, `px-5 sm:px-6` paddings
- **Sticky bottom nav** with `env(safe-area-inset-bottom)` for iPhone notch
- **Touch-friendly tap targets**: min 44×44 px on icons & buttons
- **`<meta name="viewport">`** already in `index.html`
- Test on mobile by running `npm run dev -- --host` and visiting
  `http://<your-LAN-ip>:5173` from your phone

---

## 7. DEPLOYMENT — STEP BY STEP

### 7.1 Push to GitHub

```bash
git init
git add .
git commit -m "feat: production-ready"
git branch -M main
git remote add origin https://github.com/<you>/deepbuild.ai.git
git push -u origin main
```

### 7.2 Deploy backend → Render (free)

1. Go to <https://dashboard.render.com> → **New** → **Web Service**.
2. Connect your GitHub repo.
3. Settings:
   - **Name:** `deepbuild-api`
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (upgrade later)
4. **Environment Variables** (click *Add Environment Variable* for each):

   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URI=mongodb+srv://deepbuild:PASS@cluster0.xxxxx.mongodb.net/deepbuild?retryWrites=true&w=majority
   JWT_SECRET=<paste your 96-char hex>
   JWT_EXPIRES_IN=7d
   CLIENT_ORIGIN=https://deepbuild.ai,https://www.deepbuild.ai,https://deepbuild-ai.vercel.app
   CLOUDINARY_CLOUD_NAME=xxxxx
   CLOUDINARY_API_KEY=xxxxx
   CLOUDINARY_API_SECRET=xxxxx
   ADMIN_EMAIL=admin@deepbuild.ai
   ADMIN_PASSWORD=<strong>
   ADMIN_NAME=DeepBuild Admin
   ```
5. **Create Web Service**. Wait ~3 minutes. Copy the URL — e.g.
   `https://deepbuild-api.onrender.com`.
6. **Test it:** open `https://deepbuild-api.onrender.com/api/health` →
   should return `{ "ok": true, "service": "deepbuild-api", ... }`.
7. **Seed the admin** — in Render dashboard → **Shell** tab:
   ```bash
   npm run seed
   ```

> **Render free tier note:** services sleep after 15 min of inactivity and
> take ~30s to wake. Upgrade to Starter ($7/mo) before launch.

### 7.3 Deploy frontend → Vercel

1. Go to <https://vercel.com/new> and import your GitHub repo.
2. Settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (project root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
3. **Environment Variables**:

   ```
   VITE_API_URL=https://deepbuild-api.onrender.com/api
   ```
4. **Deploy**. After ~1 minute you get e.g. `https://deepbuild-ai.vercel.app`.
5. Make sure that URL is in `CLIENT_ORIGIN` on Render (step 7.2.4) — if you
   forgot, edit it on Render and **Manual Deploy → Clear cache & deploy**.

### 7.4 Smoke test the live stack

```bash
# 1. Open https://deepbuild-ai.vercel.app
# 2. Click Sign in → use ADMIN_EMAIL / ADMIN_PASSWORD
# 3. Click Admin → upload thumbnail + 1 short video → Publish
# 4. Click Courses → your new course should appear
# 5. Click it → video plays from Cloudinary
```

---

## 8. CUSTOM DOMAIN & SSL

You bought `deepbuild.ai` (e.g. on Namecheap, Cloudflare Registrar, Porkbun).

### 8.1 Frontend domain (apex + www)

In **Vercel** → your project → **Settings → Domains**:
1. Add `deepbuild.ai` → Vercel shows DNS records.
2. Add `www.deepbuild.ai` → Vercel will redirect to apex.

In your **registrar's DNS panel**, add:

```
TYPE   NAME   VALUE                          TTL
A      @      76.76.21.21                    Auto
CNAME  www    cname.vercel-dns.com.          Auto
```

(Use the exact values Vercel shows you — they sometimes change.)

### 8.2 API subdomain

In **Render** → service → **Settings → Custom Domains**:
1. Add `api.deepbuild.ai`.
2. Render shows a CNAME. In your registrar:

```
TYPE   NAME   VALUE                                       TTL
CNAME  api    deepbuild-api.onrender.com.                 Auto
```

3. Wait for Render to mark it **Verified** (1–10 min).
4. Update Vercel env var: `VITE_API_URL=https://api.deepbuild.ai/api` →
   redeploy.
5. Update Render env var: add `https://deepbuild.ai` and
   `https://www.deepbuild.ai` to `CLIENT_ORIGIN`.

### 8.3 SSL/HTTPS

Vercel and Render **automatically issue Let's Encrypt certificates** the
moment your DNS resolves. No action needed — just wait a few minutes.

Verify: <https://www.ssllabs.com/ssltest/analyze.html?d=deepbuild.ai> →
should grade **A** or higher.

### 8.4 Force HTTPS + remove www

Both Vercel and Render redirect HTTP→HTTPS by default. To make
`www.deepbuild.ai` → `deepbuild.ai`, mark `deepbuild.ai` as **primary**
in Vercel → Domains.

---

## 9. PRE-LAUNCH TESTING CHECKLIST

Run through this on **desktop Chrome, desktop Safari, mobile iOS Safari,
mobile Android Chrome**:

### Auth
- [ ] Signup → receive token, redirected to home
- [ ] Logout → token cleared, redirect home
- [ ] Login with wrong password → red error banner
- [ ] Refresh after login → still logged in (session persists)
- [ ] Open `/admin` while logged out → redirected to `/login`
- [ ] Open `/admin` as student → redirected home
- [ ] Open `/admin` as admin → loads dashboard

### Courses & video
- [ ] Home page loads with courses from API (not seed data)
- [ ] Courses page: search filters results
- [ ] Courses page: category chips filter results
- [ ] Click a course → Watch page opens
- [ ] Video plays, pauses, seeks, mutes, fullscreens
- [ ] Switching lessons resets the player
- [ ] Finishing a lesson marks it complete (blue check)
- [ ] Progress bar updates

### Admin
- [ ] Upload a thumbnail → preview appears
- [ ] Upload a video → progress bar advances → "Ready" badge
- [ ] Publish → toast appears, course shows in "Published courses"
- [ ] New course appears on Home + Courses pages immediately
- [ ] Delete a course → removed from list and Cloudinary

### Mobile
- [ ] Bottom nav doesn't overlap iOS home indicator
- [ ] Hero text doesn't overflow
- [ ] Course carousel scrolls horizontally with snap
- [ ] Video player fits screen, fullscreen rotates correctly
- [ ] Forms zoom-in is disabled (font-size ≥ 16px on inputs)

### Performance
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) → Performance ≥ 85
- [ ] Lighthouse mobile → no critical issues
- [ ] First video starts playing within 3s on 4G

---

## 10. POST-LAUNCH IMPROVEMENTS

### 10.1 Performance

- **CDN-cache static assets** — Vercel does this automatically once you
  remove `vite-plugin-singlefile`.
- **Adaptive video streaming** — switch to Cloudinary HLS:
  ```
  https://res.cloudinary.com/<cloud>/video/upload/sp_auto/<publicId>.m3u8
  ```
  + `hls.js` on non-Safari browsers.
- **Image optimization** — replace `<img>` with `<picture>` + Cloudinary
  responsive transformations:
  ```
  https://res.cloudinary.com/<cloud>/image/upload/w_640,f_auto,q_auto/<id>
  ```
- **Compress responses** — already enabled in `server/src/index.js` via
  `compression()`.
- **Mongo indexes** — already on `email`, `slug`, and a text index on
  Course. Add more as you grow (`createdAt`, `category`).

### 10.2 Security hardening

| Risk | Mitigation (already in place ✅ or to-do 🛠) |
| --- | --- |
| Brute-force login | ✅ `express-rate-limit` global, **🛠 add stricter limit on `/auth/*`** |
| XSS | ✅ React escapes by default, ✅ `helmet()` sets CSP |
| Password leaks | ✅ bcrypt cost 12, ✅ `select: false` on field |
| Token theft | 🛠 Move JWT to **HttpOnly cookie** (replaces localStorage) |
| CORS abuse | ✅ Strict allowlist via `CLIENT_ORIGIN` |
| Mongo injection | ✅ Mongoose with Zod validation on all writes |
| File-type abuse | ✅ Cloudinary `allowed_formats` whitelist |
| Atlas exposure | 🛠 After launch: restrict `Network Access` to Render's IPs only |
| Secrets in git | ✅ `.env` in `.gitignore`, ✅ `.env.example` only |
| Dep vulnerabilities | 🛠 Add `npm audit` + Dependabot in GitHub |

**Stricter auth rate limit** — add to `server/src/routes/auth.js`:

```js
import rateLimit from "express-rate-limit";
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
router.use(authLimiter);
```

### 10.3 Scaling

- **Database**: Atlas M0 (free) → M10 ($0.08/hr) when you hit ~500 users.
- **API server**: Render Free → **Starter ($7/mo)** before launch (no
  cold starts) → **Standard** + autoscaling at ~10k DAU.
- **Video bandwidth**: Cloudinary free → Plus ($89/mo, 225 GB) when you
  hit ~3k active learners.
- **Caching layer**: add Redis (Upstash free tier) in front of Mongo for
  hot course reads — wrap `GET /api/courses` with a 60s cache.
- **Email**: add Resend or Postmark for password resets, receipts,
  course-published notifications.
- **Payments**: drop in **Stripe Checkout** for paid courses — add a
  `price` field to `Course` and a `purchases` collection.
- **Monitoring**: free [BetterStack](https://betterstack.com) + 
  [Sentry](https://sentry.io) for errors.
- **Analytics**: [Plausible](https://plausible.io) (privacy-friendly) or
  PostHog for product analytics.

---

## Quick command reference

```bash
# Local dev
npm install                   # frontend deps
cd server && npm install      # backend deps
npm run dev                   # frontend (root)
cd server && npm run dev      # backend
cd server && npm run seed     # create/promote admin

# Build & deploy
npm run build                 # builds dist/
git push origin main          # auto-deploys to Vercel + Render

# Generate secrets
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## You're live. 🚀

Your students can now sign up at `https://deepbuild.ai`, watch lessons
streamed via Cloudinary CDN, and you can publish new courses from
`https://deepbuild.ai/#/admin` from any device.

Next milestones:
1. **Stripe** for paid cohorts.
2. **Email** drip onboarding (Resend + React Email).
3. **Course completion certificates** (PDF generation).
4. **Discussions** under each lesson (threaded comments collection).
5. **Mobile app** — wrap the same React app with **Capacitor** for App Store + Play Store.
