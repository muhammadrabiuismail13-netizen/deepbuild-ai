import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/courses.js";
import uploadRoutes from "./routes/uploads.js";
import { errorHandler, notFound } from "./middleware/error.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === "production";

// --- Trust Render / Railway proxy ---
app.set("trust proxy", 1);

// --- Security ---
app.use(
  helmet({
    contentSecurityPolicy: false, // let the SPA serve its own scripts
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(compression());
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// --- CORS ---
const allowed = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // No origin → curl/postman/server-side
      if (!origin) return cb(null, true);
      // In dev, allow anything from localhost
      if (!isProd && origin.includes("localhost")) return cb(null, true);
      // Check allowlist
      if (allowed.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  }),
);

// --- Logger ---
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(isProd ? "combined" : "tiny"));
}

// --- Rate limit ---
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProd ? 300 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

// Auth-specific stricter limit
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

// --- Health check ---
app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "deepbuild-api",
    env: process.env.NODE_ENV || "development",
    time: new Date().toISOString(),
  });
});

// --- API Routes ---
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/uploads", uploadRoutes);

// --- Serve frontend in production (single-deploy option) ---
// If you build the frontend and copy dist/ into server/public/,
// the backend will serve the SPA and handle client-side routing.
const clientBuild = path.resolve(__dirname, "../../dist");
if (isProd) {
  app.use(express.static(clientBuild, { maxAge: "30d" }));
  // Any non-API route → serve index.html (SPA client routing)
  app.get(/^(?!\/api\/).*/, (_req, res, next) => {
    res.sendFile(path.join(clientBuild, "index.html"), (err) => {
      if (err) next(); // fallback to 404 handler if file doesn't exist
    });
  });
}

// --- 404 + error ---
app.use(notFound);
app.use(errorHandler);

// --- Start ---
connectDB(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `✅ DeepBuild API listening on http://localhost:${PORT} [${process.env.NODE_ENV || "development"}]`,
      );
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB", err);
    process.exit(1);
  });
