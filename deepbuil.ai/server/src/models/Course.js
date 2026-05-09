import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    duration: { type: String, required: true }, // e.g. "12:30"
    videoUrl: { type: String, required: true },
    videoPublicId: String, // Cloudinary public_id (for deletion)
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const courseSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, required: true, maxlength: 2000 },
    category: {
      type: String,
      required: true,
      enum: [
        "Foundations",
        "Entrepreneurship",
        "Creator Studio",
        "Productivity",
      ],
    },
    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    duration: { type: String, required: true }, // e.g. "1h 12m"
    thumbnailUrl: { type: String, required: true },
    thumbnailPublicId: String,
    instructor: { type: String, default: "DeepBuild Team" },
    lessons: [lessonSchema],
    publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

courseSchema.index({ title: "text", description: "text", category: "text" });

export default mongoose.model("Course", courseSchema);
