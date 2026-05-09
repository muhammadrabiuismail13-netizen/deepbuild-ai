import { useRef, useState } from "react";
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  Video,
  Plus,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useCourses } from "../store/CoursesContext";
import type { Module } from "../data/modules";

const CATEGORIES = [
  "Foundations",
  "Entrepreneurship",
  "Creator Studio",
  "Productivity",
];

const LEVELS: Module["level"][] = ["Beginner", "Intermediate", "Advanced"];

type DraftLesson = {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
  videoName?: string;
  uploading?: boolean;
  uploadProgress?: number;
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function simulateUpload(
  onProgress: (pct: number) => void,
): Promise<void> {
  return new Promise((resolve) => {
    let pct = 0;
    const iv = setInterval(() => {
      pct += Math.random() * 25 + 10;
      if (pct >= 100) {
        pct = 100;
        clearInterval(iv);
        onProgress(100);
        setTimeout(resolve, 200);
      } else {
        onProgress(Math.round(pct));
      }
    }, 150);
  });
}

export default function AdminPage() {
  const { modules, addModule, removeModule } = useCourses();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [level, setLevel] = useState<Module["level"]>("Beginner");
  const [duration, setDuration] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [thumbName, setThumbName] = useState<string>("");
  const [thumbUploading, setThumbUploading] = useState(false);

  const [lessons, setLessons] = useState<DraftLesson[]>([
    { id: uid(), title: "", duration: "", videoUrl: "" },
  ]);

  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  const thumbInput = useRef<HTMLInputElement | null>(null);

  const onPickThumb = async (file: File) => {
    setThumbUploading(true);
    setError(null);
    try {
      await simulateUpload(() => {});
      const url = URL.createObjectURL(file);
      setThumbnailUrl(url);
      setThumbName(file.name);
    } catch {
      setError("Thumbnail upload failed");
    } finally {
      setThumbUploading(false);
    }
  };

  const onPickVideo = async (lessonId: string, file: File) => {
    setLessons((prev) =>
      prev.map((l) =>
        l.id === lessonId
          ? { ...l, uploading: true, uploadProgress: 0, videoName: file.name }
          : l,
      ),
    );
    try {
      await simulateUpload((pct) => {
        setLessons((prev) =>
          prev.map((l) =>
            l.id === lessonId ? { ...l, uploadProgress: pct } : l,
          ),
        );
      });
      const url = URL.createObjectURL(file);
      setLessons((prev) =>
        prev.map((l) =>
          l.id === lessonId
            ? { ...l, videoUrl: url, uploading: false, uploadProgress: 100 }
            : l,
        ),
      );
    } catch {
      setError("Video upload failed");
      setLessons((prev) =>
        prev.map((l) =>
          l.id === lessonId ? { ...l, uploading: false } : l,
        ),
      );
    }
  };

  const addLesson = () =>
    setLessons((prev) => [
      ...prev,
      { id: uid(), title: "", duration: "", videoUrl: "" },
    ]);

  const removeLesson = (lessonId: string) =>
    setLessons((prev) => prev.filter((l) => l.id !== lessonId));

  const updateLesson = (
    lessonId: string,
    field: keyof DraftLesson,
    value: string,
  ) =>
    setLessons((prev) =>
      prev.map((l) => (l.id === lessonId ? { ...l, [field]: value } : l)),
    );

  const canPublish =
    !publishing &&
    title.trim() &&
    description.trim() &&
    duration.trim() &&
    thumbnailUrl &&
    lessons.length > 0 &&
    lessons.every(
      (l) => l.title.trim() && l.duration.trim() && l.videoUrl && !l.uploading,
    );

  const onPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPublish) return;
    setPublishing(true);
    setError(null);

    try {
      const newModule: Module = {
        id: `course-${uid()}`,
        title: title.trim(),
        description: description.trim(),
        category,
        level,
        duration: duration.trim(),
        thumbnail: thumbnailUrl,
        instructor: "Admin",
        lessons: lessons.map((l) => ({
          id: l.id,
          title: l.title.trim(),
          duration: l.duration.trim(),
          videoUrl: l.videoUrl,
        })),
      };

      addModule(newModule);
      setToast(`Published "${title.trim()}" successfully!`);
      setTimeout(() => setToast(null), 4000);

      // Reset form
      setTitle("");
      setDescription("");
      setCategory(CATEGORIES[0]);
      setLevel("Beginner");
      setDuration("");
      setThumbnailUrl("");
      setThumbName("");
      setLessons([{ id: uid(), title: "", duration: "", videoUrl: "" }]);
    } catch {
      setError("Publish failed");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="px-5 pt-4 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Admin Dashboard
      </h1>
      <p className="mt-2 max-w-xl text-sm text-white/55">
        Upload new courses, manage lessons, and publish content. Everything
        persists across reloads.
      </p>

      {/* Status */}
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-200">
        <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
        System online — uploads and publishing are active
      </div>

      {toast && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-[var(--db-blue)]/40 bg-[var(--db-blue)]/10 px-4 py-3 text-sm text-white">
          <CheckCircle2 size={16} className="text-[var(--db-blue-soft)]" />
          {toast}
        </div>
      )}
      {error && (
        <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={onPublish} className="mt-6 space-y-6">
        {/* Course details */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h2 className="text-base font-semibold text-white">Course details</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Title">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Build SaaS with AI Agents"
                className="db-input"
              />
            </Field>
            <Field label="Total duration">
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 1h 20m"
                className="db-input"
              />
            </Field>
            <Field label="Category">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="db-input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-black">{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Level">
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as Module["level"])}
                className="db-input"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l} className="bg-black">{l}</option>
                ))}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Description">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="What will students learn?"
                  className="db-input resize-none"
                />
              </Field>
            </div>

            {/* Thumbnail */}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
                Thumbnail
              </label>
              <input
                ref={thumbInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  e.target.files?.[0] && onPickThumb(e.target.files[0])
                }
              />
              <button
                type="button"
                onClick={() => thumbInput.current?.click()}
                className="flex w-full items-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/5 px-4 py-4 text-left transition-colors hover:bg-white/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-white">
                  {thumbUploading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <ImageIcon size={20} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white">
                    {thumbName || "Upload course thumbnail"}
                  </p>
                  <p className="truncate text-xs text-white/50">
                    {thumbUploading ? "Processing..." : "PNG or JPG · 16:9 recommended"}
                  </p>
                </div>
                {thumbnailUrl && (
                  <img
                    src={thumbnailUrl}
                    alt="thumb"
                    className="h-12 w-20 rounded-md object-cover"
                  />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Lessons */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Lessons</h2>
            <button
              type="button"
              onClick={addLesson}
              className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Plus size={14} />
              Add lesson
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {lessons.map((l, i) => (
              <LessonRow
                key={l.id}
                lesson={l}
                index={i}
                onChange={(field, value) => updateLesson(l.id, field, value)}
                onPickVideo={(file) => onPickVideo(l.id, file)}
                onRemove={
                  lessons.length > 1 ? () => removeLesson(l.id) : undefined
                }
              />
            ))}
          </div>
        </section>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <p className="text-xs text-white/45">All fields required to publish.</p>
          <button
            type="submit"
            disabled={!canPublish}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-opacity disabled:opacity-40"
          >
            {publishing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Upload size={16} />
            )}
            {publishing ? "Publishing..." : "Publish course"}
          </button>
        </div>
      </form>

      {/* Published list */}
      <section className="mt-12">
        <h2 className="text-lg font-semibold text-white">
          Published courses ({modules.length})
        </h2>
        <div className="mt-3 space-y-2">
          {modules.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/5 p-3"
            >
              <img
                src={m.thumbnail}
                alt={m.title}
                className="h-12 w-20 rounded-md object-cover bg-white/10"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {m.title}
                </p>
                <p className="text-xs text-white/50">
                  {m.category} · {m.lessons.length} lessons · {m.duration}
                </p>
              </div>
              <button
                onClick={() => removeModule(m.id)}
                className="rounded-md p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Remove course"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .db-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 10px;
          padding: 10px 12px;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: border-color .15s ease, background .15s ease;
        }
        .db-input::placeholder { color: rgba(255,255,255,0.35); }
        .db-input:focus {
          border-color: rgba(47,107,255,0.6);
          background: rgba(255,255,255,0.06);
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
        {label}
      </span>
      {children}
    </label>
  );
}

function LessonRow({
  lesson,
  index,
  onChange,
  onPickVideo,
  onRemove,
}: {
  lesson: DraftLesson;
  index: number;
  onChange: (field: keyof DraftLesson, value: string) => void;
  onPickVideo: (file: File) => void;
  onRemove?: () => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="rounded-xl border border-white/8 bg-black/30 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
          Lesson {index + 1}
        </p>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-md p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Remove lesson"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <input
            value={lesson.title}
            onChange={(e) => onChange("title", e.target.value)}
            placeholder="Lesson title"
            className="db-input"
          />
        </div>
        <input
          value={lesson.duration}
          onChange={(e) => onChange("duration", e.target.value)}
          placeholder="Duration (e.g. 12:30)"
          className="db-input"
        />
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onPickVideo(e.target.files[0])}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={lesson.uploading}
        className="mt-3 flex w-full items-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/5 px-3 py-3 text-left transition-colors hover:bg-white/10 disabled:opacity-60"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white">
          {lesson.uploading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Video size={18} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            {lesson.videoName || "Upload video file"}
          </p>
          <p className="text-xs text-white/50">
            {lesson.uploading
              ? `Uploading… ${lesson.uploadProgress ?? 0}%`
              : "MP4, MOV, or WebM"}
          </p>
          {lesson.uploading && (
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-[var(--db-blue-soft)] transition-[width] duration-200"
                style={{ width: `${lesson.uploadProgress ?? 0}%` }}
              />
            </div>
          )}
        </div>
        {lesson.videoUrl && !lesson.uploading && (
          <span className="rounded-full bg-[var(--db-blue)]/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--db-blue-soft)]">
            Ready
          </span>
        )}
      </button>
    </div>
  );
}
