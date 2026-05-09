import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Maximize,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useCourses } from "../store/CoursesContext";

function formatTime(s: number) {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${sec}`;
}

export default function WatchPage() {
  const { id } = useParams();
  const { getModule } = useCourses();
  const mod = id ? getModule(id) : undefined;

  const [activeLessonIdx, setActiveLessonIdx] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const lesson = mod?.lessons[activeLessonIdx];

  useEffect(() => {
    setPlaying(false);
    setProgress(0);
    setDuration(0);
  }, [activeLessonIdx, id]);

  if (!mod || !lesson) {
    return (
      <div className="px-6 py-20 text-center">
        <p className="text-lg text-white/60">Course not found.</p>
        <Link
          to="/courses"
          className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"
        >
          Back to courses
        </Link>
      </div>
    );
  }

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const goFullscreen = () => {
    const v = videoRef.current;
    if (v?.requestFullscreen) v.requestFullscreen();
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const t = Number(e.target.value);
    v.currentTime = t;
    setProgress(t);
  };

  const markComplete = (lessonId: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(lessonId);
      return next;
    });
  };

  const completionPct = Math.round(
    (completed.size / mod.lessons.length) * 100,
  );

  return (
    <div className="px-4 pt-2 sm:px-6">
      <Link
        to="/courses"
        className="inline-flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-white"
      >
        <ChevronLeft size={16} />
        All courses
      </Link>

      {/* Player */}
      <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black">
        <div className="relative aspect-video w-full bg-black">
          <video
            ref={videoRef}
            key={lesson.videoUrl + lesson.id}
            src={lesson.videoUrl}
            poster={mod.thumbnail}
            className="h-full w-full"
            onTimeUpdate={(e) =>
              setProgress((e.target as HTMLVideoElement).currentTime)
            }
            onLoadedMetadata={(e) =>
              setDuration((e.target as HTMLVideoElement).duration)
            }
            onEnded={() => {
              setPlaying(false);
              markComplete(lesson.id);
            }}
            onClick={togglePlay}
            playsInline
            crossOrigin="anonymous"
          />

          {!playing && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-black shadow-2xl">
                <Play size={26} fill="currentColor" />
              </span>
            </button>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <input
              type="range"
              className="db-range w-full"
              min={0}
              max={duration || 0}
              step={0.1}
              value={progress}
              onChange={onSeek}
            />
            <div className="mt-1 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button onClick={togglePlay} className="text-white">
                  {playing ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button onClick={toggleMute} className="text-white">
                  {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <span className="text-xs text-white/70">
                  {formatTime(progress)} / {formatTime(duration)}
                </span>
              </div>
              <button onClick={goFullscreen} className="text-white">
                <Maximize size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course info */}
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--db-blue-soft)]">
          {mod.category} · {mod.level}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {mod.title}
        </h1>
        <p className="mt-2 text-sm text-white/65 sm:text-base">
          {mod.description}
        </p>
        <p className="mt-2 text-xs text-white/45">By {mod.instructor}</p>
      </div>

      {/* Progress */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-white">Your progress</p>
          <p className="text-sm text-white/65">
            {completed.size}/{mod.lessons.length} · {completionPct}%
          </p>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-[var(--db-blue-soft)] transition-[width] duration-300"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* Lessons */}
      <div className="mt-6 mb-2">
        <h2 className="text-lg font-semibold text-white">Lessons</h2>
      </div>
      <ul className="space-y-2">
        {mod.lessons.map((l, i) => {
          const isActive = i === activeLessonIdx;
          const done = completed.has(l.id);
          return (
            <li key={l.id}>
              <button
                onClick={() => setActiveLessonIdx(i)}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors ${
                  isActive
                    ? "border-[var(--db-blue)]/40 bg-[var(--db-blue)]/10"
                    : "border-white/8 bg-white/5 hover:bg-white/8"
                }`}
              >
                <span className="text-white/70">
                  {done ? (
                    <CheckCircle2
                      size={20}
                      className="text-[var(--db-blue-soft)]"
                    />
                  ) : (
                    <Circle size={20} />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {i + 1}. {l.title}
                  </p>
                  <p className="text-xs text-white/50">{l.duration}</p>
                </div>
                {isActive && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                    Now playing
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
