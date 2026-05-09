import { Router } from "express";
import { uploadVideo, uploadImage } from "../middleware/upload.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = Router();

// POST /api/uploads/video  (multipart/form-data, field "file")
router.post(
  "/video",
  requireAuth,
  requireAdmin,
  uploadVideo.single("file"),
  (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.status(201).json({
      url: req.file.path, // Cloudinary secure URL
      publicId: req.file.filename, // Cloudinary public_id
      duration: req.file.duration, // seconds (if available)
      bytes: req.file.size,
      format: req.file.format,
    });
  },
);

// POST /api/uploads/image  (multipart/form-data, field "file")
router.post(
  "/image",
  requireAuth,
  requireAdmin,
  uploadImage.single("file"),
  (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    res.status(201).json({
      url: req.file.path,
      publicId: req.file.filename,
      bytes: req.file.size,
      format: req.file.format,
    });
  },
);

export default router;
