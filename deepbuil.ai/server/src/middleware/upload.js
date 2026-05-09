import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Video uploads — stored under deepbuild/videos/
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "deepbuild/videos",
    resource_type: "video",
    allowed_formats: ["mp4", "mov", "webm", "mkv", "m4v"],
  },
});

// Image uploads — stored under deepbuild/thumbnails/
const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "deepbuild/thumbnails",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1280, height: 720, crop: "fill" }],
  },
});

export const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB
});

export const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});
