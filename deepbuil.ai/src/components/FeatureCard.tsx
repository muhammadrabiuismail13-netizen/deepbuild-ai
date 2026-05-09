import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function FeatureCard() {
  return (
    <div className="relative mx-4 sm:mx-6">
      <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
        {/* Single brand glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[var(--db-blue)]/20 blur-3xl" />

        <div className="relative z-10 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
            New · 2026 Cohort
          </p>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80">
            <ArrowUpRight size={16} />
          </div>
        </div>

        <h3 className="relative z-10 mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Welcome to{" "}
          <span className="text-[var(--db-blue-soft)]">DeepBuild.ai</span>
        </h3>
        <p className="relative z-10 mt-2 text-base font-medium text-white/70 sm:text-lg">
          Learn AI, Build Skills, Create Opportunities.
        </p>

        <p className="relative z-10 mt-5 text-[15px] leading-relaxed text-white/60 sm:text-base">
          Join thousands learning how to use AI to grow businesses, gain skills,
          and create income streams.
        </p>

        <div className="relative z-10 mt-6 flex items-center gap-3">
          <Link
            to="/courses"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-white/90"
          >
            Start Learning
          </Link>
          <Link
            to="/courses"
            className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10"
          >
            Browse Tracks
          </Link>
        </div>
      </div>
    </div>
  );
}
