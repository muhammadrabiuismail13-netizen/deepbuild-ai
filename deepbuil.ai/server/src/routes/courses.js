import { Router } from "express";
import { z } from "zod";
import Course from "../models/Course.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import cloudinary from "../config/cloudinary.js";

const router = Router();

const lessonInput = z.object({
  title: z.string().min(1),
  duration: z.string().min(1),
  videoUrl: z.string().url(),
  videoPublicId: z.string().optional(),
});

const courseInput = z.object({
  title: z.string().min(2).max(140),
  description: z.string().min(10).max(2000),
  category: z.enum([
    "Foundations",
    "Entrepreneurship",
    "Creator Studio",
    "Productivity",
  ]),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  duration: z.string().min(1),
  thumbnailUrl: z.string().url(),
  thumbnailPublicId: z.string().optional(),
  instructor: z.string().optional(),
  lessons: z.array(lessonInput).min(1),
});

function slugify(str) {
  return (
    str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 64) || "course"
  );
}

// Public — list all
router.get("/", async (req, res, next) => {
  try {
    const { q, category } = req.query;
    const filter = { isPublished: true };
    if (category && category !== "All") filter.category = category;
    if (q) filter.$text = { $search: String(q) };
    const courses = await Course.find(filter).sort({ createdAt: -1 });
    res.json({ courses });
  } catch (err) {
    next(err);
  }
});

// Public — get single by slug or id
router.get("/:idOrSlug", async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const isObjectId = /^[a-f\d]{24}$/i.test(idOrSlug);
    const course = isObjectId
      ? await Course.findById(idOrSlug)
      : await Course.findOne({ slug: idOrSlug });
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json({ course });
  } catch (err) {
    next(err);
  }
});

// Admin — create
router.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = courseInput.parse(req.body);
    let slug = slugify(data.title);
    // ensure unique slug
    if (await Course.findOne({ slug })) slug = `${slug}-${Date.now().toString(36)}`;

    const course = await Course.create({
      ...data,
      slug,
      publishedBy: req.user._id,
    });
    res.status(201).json({ course });
  } catch (err) {
    if (err.name === "ZodError") {
      return res
        .status(400)
        .json({ error: "Invalid input", issues: err.issues });
    }
    next(err);
  }
});

// Admin — update
router.put("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = courseInput.partial().parse(req.body);
    const course = await Course.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json({ course });
  } catch (err) {
    next(err);
  }
});

// Admin — delete (also removes Cloudinary assets)
router.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // Best-effort cleanup
    const tasks = [];
    if (course.thumbnailPublicId) {
      tasks.push(
        cloudinary.uploader.destroy(course.thumbnailPublicId, {
          resource_type: "image",
        }),
      );
    }
    course.lessons.forEach((l) => {
      if (l.videoPublicId) {
        tasks.push(
          cloudinary.uploader.destroy(l.videoPublicId, {
            resource_type: "video",
          }),
        );
      }
    });
    await Promise.allSettled(tasks);

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
