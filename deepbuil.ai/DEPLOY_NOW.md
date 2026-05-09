# 🚀 GET DEEPBUILD.AI LIVE ON THE INTERNET — 15 MINUTES

This is the EXACT step-by-step to make your site accessible to anyone
who types the URL in their browser. No coding needed — just clicking
and pasting.

You will need:
- A computer with internet
- An email address
- A GitHub account (free)

After these steps, your site will be at a URL like:
**https://deepbuild-ai.vercel.app** (free, instant)
Or your own domain **https://deepbuild.ai** (requires buying the domain)

---

## STEP 1: Create a GitHub Account (skip if you have one)

1. Go to **https://github.com/signup**
2. Create an account with your email
3. Verify your email

---

## STEP 2: Upload Your Code to GitHub (3 minutes)

### Option A: Using GitHub Website (easiest, no terminal)

1. Go to **https://github.com/new**
2. Repository name: `deepbuild-ai`
3. Set to **Public**
4. Click **Create repository**
5. You'll see an empty repo page

Now you need to upload the files. Since you have the code from this tool:

1. Download all files from this project as a ZIP
2. Extract the ZIP on your computer
3. On your GitHub repo page, click **"uploading an existing file"** link
4. Drag and drop ALL the extracted files into the upload area
5. Click **Commit changes**

### Option B: Using Terminal (if you know how)

```bash
# On your computer, open Terminal/Command Prompt
# Navigate to where you saved the project files
cd deepbuild-ai

git init
git add .
git commit -m "DeepBuild.ai launch"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/deepbuild-ai.git
git push -u origin main
```

---

## STEP 3: Deploy to Vercel (5 minutes) — THIS MAKES IT LIVE

1. Go to **https://vercel.com**
2. Click **Sign Up** → Choose **Continue with GitHub**
3. Authorize Vercel to access your GitHub

4. Once logged in, click **"Add New..."** → **"Project"**
5. Find your **deepbuild-ai** repository → click **Import**

6. On the Configure page:
   - **Framework Preset**: Select **Vite**
   - **Root Directory**: Leave as `./`
   - Leave everything else as default

7. Click **Deploy**

8. Wait 1-2 minutes... ⏳

9. 🎉 **YOU'RE LIVE!** Vercel gives you a URL like:
   ```
   https://deepbuild-ai.vercel.app
   ```

10. **Click that URL** — your website is now on the internet!
    Anyone in the world can open it.

---

## STEP 4: Test Your Live Site

Open your URL in a browser (or send it to a friend's phone):

### Test Admin:
1. Click **Sign in**
2. Email: `admin@deepbuild.ai`
3. Password: `admin123`
4. You should see the **Admin** button → click it
5. Try uploading a course with thumbnail and video

### Test Student:
1. Sign out
2. Click **Create an account**
3. Use any email/password
4. Browse courses → watch videos

### Test Mobile:
1. Open the same URL on your phone
2. Everything should work perfectly

---

## STEP 5: Connect Your Own Domain (Optional)

If you bought **deepbuild.ai** from Namecheap, GoDaddy, Cloudflare, etc:

1. In **Vercel** → your project → **Settings** → **Domains**
2. Type `deepbuild.ai` → click **Add**
3. Vercel shows you DNS records to add
4. Go to your **domain registrar** (where you bought the domain)
5. Go to **DNS Settings**
6. Add these records:

```
Type    Name    Value                   TTL
A       @       76.76.21.21             Auto
CNAME   www     cname.vercel-dns.com    Auto
```

7. Wait 5-15 minutes
8. Now **https://deepbuild.ai** opens your site!
9. SSL/HTTPS is automatic — no extra setup

---

## DONE! 🎉

Your website is now:
- ✅ Live on the internet
- ✅ Accessible to anyone with the URL
- ✅ Works on desktop AND mobile
- ✅ Has SSL (https://)
- ✅ Admin can upload courses
- ✅ Students can sign up and watch videos
- ✅ Free hosting (Vercel free tier = 100GB bandwidth/month)

---

## FAQ

**Q: Is this really free?**
Yes. Vercel free tier + GitHub free = $0/month. Handles thousands of users.

**Q: How do I update the site?**
Push new code to GitHub → Vercel auto-redeploys in ~1 minute.

**Q: Can I use a custom domain?**
Yes. Buy a domain ($10-15/year) and follow Step 5 above.

**Q: How many users can it handle?**
The free tier handles thousands of concurrent users easily.
Course data is stored in each user's browser (localStorage).
For a shared database (all users see same courses), you'd add
a backend later — the server/ folder has everything ready.

**Q: Where are videos stored?**
Currently: in the user's browser memory (works for demo/launch).
For production scale: connect Cloudinary (free tier = 25GB).
The backend code for this is already in the server/ folder.
