# 🚀 DeepBuild.ai — Deploy to LIVE (Exact Steps)

This is NOT a tutorial. These are the **exact commands and clicks** to go live.  
Time required: **~45 minutes**.

---

## STEP 1: Create MongoDB Atlas Database (5 min)

1. Open: **https://cloud.mongodb.com** → Sign up / Sign in
2. Click **Build a Database** → Select **M0 FREE** → Region: **US East (Virginia)** → Click **Create**
3. On the "Security Quickstart" page:
   - **Username:** `deepbuild`
   - **Password:** Click "Autogenerate" → **COPY THIS PASSWORD** → Save it in a note
   - Click **Create User**
4. Scroll to "Where would you like to connect from?":
   - Select **Cloud Environment**
   - Click **+ Add Access from Anywhere** (adds `0.0.0.0/0`)
   - Click **Finish and Close**
5. On the left sidebar, click **Database** → Click **Connect** on your cluster
6. Choose **Drivers** → Copy the connection string. It looks like:
   ```
   mongodb+srv://deepbuild:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
   ```
7. Replace `<password>` with the password you copied, and add `/deepbuild` before the `?`:
   ```
   mongodb+srv://deepbuild:YOUR_PASSWORD@cluster0.abc123.mongodb.net/deepbuild?retryWrites=true&w=majority
   ```
8. **Save this full URI.** You'll use it in Step 3.

---

## STEP 2: Create Cloudinary Account (3 min)

1. Open: **https://cloudinary.com/users/register/free** → Sign up
2. After login, you land on the **Dashboard**
3. Copy these 3 values (they're right on the dashboard):
   - **Cloud name** (e.g. `dxyz1abc2`)
   - **API Key** (e.g. `123456789012345`)
   - **API Secret** (e.g. `AbCdEfGhIjKlMnOpQrStUvWx`)
4. **Save all 3.** You'll use them in Step 3.

---

## STEP 3: Deploy Backend to Render (10 min)

### 3a. Push code to GitHub

If you haven't already:
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/deepbuild-ai.git
git push -u origin main
```

### 3b. Create the Render web service

1. Open: **https://dashboard.render.com** → Sign up with GitHub
2. Click **New** → **Web Service**
3. **Connect your GitHub repo** (the one you just pushed)
4. Fill in these settings:

| Setting | Value |
|---|---|
| **Name** | `deepbuild-api` |
| **Root Directory** | `server` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` (or `Starter $7/mo` for no cold starts) |

5. Click **Advanced** → **Add Environment Variable** for each:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGO_URI` | *(paste your Atlas URI from Step 1)* |
| `JWT_SECRET` | *(open terminal, run: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` → paste the output)* |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_ORIGIN` | `https://deepbuild-ai.vercel.app,https://deepbuild.ai,https://www.deepbuild.ai` |
| `CLOUDINARY_CLOUD_NAME` | *(from Step 2)* |
| `CLOUDINARY_API_KEY` | *(from Step 2)* |
| `CLOUDINARY_API_SECRET` | *(from Step 2)* |
| `ADMIN_EMAIL` | `admin@deepbuild.ai` |
| `ADMIN_PASSWORD` | *(choose a strong password, e.g. `MyStr0ng!Pass2024`)* |
| `ADMIN_NAME` | `DeepBuild Admin` |

6. Click **Create Web Service**
7. Wait 3–5 minutes for the first deploy to finish
8. Copy the URL Render gives you (e.g. `https://deepbuild-api.onrender.com`)

### 3c. Test the backend

Open in browser: **`https://deepbuild-api.onrender.com/api/health`**

You should see:
```json
{"ok":true,"service":"deepbuild-api","env":"production","time":"..."}
```

If you see this, the backend is LIVE. ✅

### 3d. Seed the admin user

In Render dashboard → your service → **Shell** tab (or **Manual Shell**):
```bash
npm run seed
```

You should see: `✅ Created admin user: admin@deepbuild.ai`

---

## STEP 4: Deploy Frontend to Vercel (5 min)

1. Open: **https://vercel.com/new** → Sign in with GitHub
2. **Import** your `deepbuild-ai` repository
3. Settings:

| Setting | Value |
|---|---|
| **Framework Preset** | `Vite` |
| **Root Directory** | `./` (leave default) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

4. Click **Environment Variables** → Add:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://deepbuild-api.onrender.com/api` |

> ⚠️ Replace `deepbuild-api.onrender.com` with YOUR actual Render URL from Step 3.

5. Click **Deploy**
6. Wait ~1 minute. Copy the URL Vercel gives you (e.g. `https://deepbuild-ai.vercel.app`)

### 4b. Update Render CORS

Go back to **Render** → your service → **Environment** → find `CLIENT_ORIGIN` → add your Vercel URL:
```
https://deepbuild-ai.vercel.app,https://deepbuild.ai,https://www.deepbuild.ai
```
Click **Save Changes** → Render will auto-redeploy.

---

## STEP 5: Test Everything (5 min)

Open your Vercel URL (e.g. `https://deepbuild-ai.vercel.app`)

### Test 1: Admin login
1. Click **Sign in** (top right)
2. Email: `admin@deepbuild.ai`
3. Password: *(the password you set in ADMIN_PASSWORD)*
4. You should be logged in → **Admin** button appears in top bar

### Test 2: Upload a course
1. Click **Admin**
2. Fill in: Title = "Test Course", Duration = "10m", Description = "Testing upload"
3. Click the thumbnail upload box → pick any image from your computer
4. Wait for it to upload (shows "Uploading to Cloudinary...")
5. Under Lessons: Title = "Lesson 1", Duration = "5:00"
6. Click video upload box → pick any MP4 file (small, <50MB for testing)
7. Wait for progress bar to reach 100% → shows "Ready"
8. Click **Publish course**
9. You should see a green toast: "Published successfully"

### Test 3: Watch the course
1. Click **Courses** in bottom nav
2. Your "Test Course" should appear
3. Click it → video player opens → press play → video streams from Cloudinary

### Test 4: Student signup
1. Click **Sign out**
2. Click **Sign in** → **Create an account**
3. Sign up with a different email
4. You should be logged in as a student (no Admin button)
5. Go to Courses → click a course → watch the video

### Test 5: Mobile
1. Open the same URL on your phone
2. Everything should work: bottom nav, video player, scrolling

---

## STEP 6: Connect Custom Domain (Optional, 10 min)

### 6a. Frontend domain → Vercel

1. In **Vercel** → your project → **Settings** → **Domains**
2. Type `deepbuild.ai` → **Add**
3. Vercel shows DNS records. Go to your **domain registrar** (Namecheap, Cloudflare, etc.)
4. Add these DNS records:

```
Type    Name    Value                   TTL
A       @       76.76.21.21             Auto
CNAME   www     cname.vercel-dns.com    Auto
```

5. Wait 5–10 minutes → Vercel marks it **Valid** and auto-issues SSL

### 6b. API subdomain → Render

1. In **Render** → your service → **Settings** → **Custom Domains**
2. Add `api.deepbuild.ai`
3. Render shows a CNAME value. Add to your DNS:

```
Type    Name    Value                                   TTL
CNAME   api     deepbuild-api.onrender.com              Auto
```

4. Wait for Render to verify → shows **Verified**

### 6c. Update environment variables

**In Vercel** → Environment Variables:
```
VITE_API_URL=https://api.deepbuild.ai/api
```
→ **Redeploy** (Settings → Deployments → Redeploy latest)

**In Render** → Environment:
```
CLIENT_ORIGIN=https://deepbuild.ai,https://www.deepbuild.ai,https://deepbuild-ai.vercel.app
```
→ Auto-redeploys.

### 6d. Verify

- Open `https://deepbuild.ai` → site loads ✅
- Open `https://api.deepbuild.ai/api/health` → JSON response ✅
- Sign in, upload, watch → everything works ✅

---

## DONE 🎉

Your platform is now LIVE at:
- **Website:** `https://deepbuild.ai` (or your Vercel URL)
- **API:** `https://api.deepbuild.ai/api` (or your Render URL)
- **Admin login:** `admin@deepbuild.ai` + your password
- **Videos:** Hosted on Cloudinary CDN (global, fast)
- **Database:** MongoDB Atlas (auto-backed-up)

### What you can do now:
1. **Upload courses** from the Admin dashboard on any device
2. **Share the link** — people sign up and start learning
3. **Monitor** on Render dashboard (logs, uptime) + Cloudinary dashboard (bandwidth)

### Next steps when you grow:
- Upgrade Render to **Starter ($7/mo)** to remove cold starts
- Upgrade Cloudinary to **Plus ($89/mo)** for more video bandwidth
- Add **Stripe** for paid courses
- Add **email** (Resend) for password resets & notifications
