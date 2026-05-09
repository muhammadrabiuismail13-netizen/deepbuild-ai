import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import type { Module } from "../data/modules";

type Props = {
  module: Module;
  variant?: "carousel" | "grid";
};

export default function ModuleCard({ module, variant = "carousel" }: Props) {
  const widthCls =
    variant === "carousel"
      ? "w-[78vw] flex-shrink-0 snap-start sm:w-[360px]"
      : "w-full";

  return (
    <Link to={`/watch/${module.id}`} className={`group block ${widthCls}`}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/8 bg-white/5">
        <img
          src={module.thumbnail}
          alt={module.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Subtle blue tint to keep palette unified */}
        <div className="pointer-events-none absolute inset-0 bg-[var(--db-blue)]/5 mix-blend-overlay" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Play button (hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-2xl">
            <Play size={22} fill="currentColor" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-black/65 px-2 py-1 text-xs font-medium text-white backdrop-blur-md">
          <Play size={10} fill="currentColor" />
          {module.duration}
        </div>

        {/* Category tag */}
        <div className="absolute left-3 top-3 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
          {module.category}
        </div>
      </div>

      <h3 className="mt-3 px-1 text-[15px] font-semibold leading-snug text-white sm:text-base">
        {module.title}
      </h3>
      <p className="mt-1 px-1 text-xs text-white/50">
        {module.level} · {module.lessons.length} lessons
      </p>
    </Link>
  );
}
