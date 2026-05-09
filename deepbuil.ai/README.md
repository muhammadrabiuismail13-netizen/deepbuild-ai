# DeepBuild.ai

AI-powered learning platform — teach people how to build businesses and skills using AI.

## Quick start

```bash
# Frontend
npm install
cp .env.example .env.local
npm run dev               # → http://localhost:5173

# Backend (in another terminal)
cd server
npm install
cp .env.example .env      # fill in MONGO_URI, JWT_SECRET, CLOUDINARY_*
npm run dev               # → http://localhost:5000
npm run seed              # creates first admin user
```

## Architecture

| Layer | Tech |
| --- | --- |
| Frontend | React 19 · Vite · Tailwind CSS 4 · React Router |
| Backend | Node 18 · Express · Mongoose · JWT · Zod · Helmet |
| Database | MongoDB (Atlas) |
| Media | Cloudinary (videos + thumbnails, CDN-delivered) |
| Hosting | Vercel (frontend) · Render (API) |

## Repo layout

```
src/                React app
server/             Express API
public/             Static assets
DEPLOYMENT.md       👈 Step-by-step launch guide
```

## Going live

Read **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full production guide:
database setup, video uploads, auth, Vercel/Render deployment, custom
domain (`deepbuild.ai`), SSL, testing checklist, and post-launch scaling.
