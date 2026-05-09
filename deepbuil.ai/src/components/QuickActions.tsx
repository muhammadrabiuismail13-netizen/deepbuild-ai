import { Sparkles, Bot, TrendingUp, GraduationCap } from "lucide-react";

const items = [
  {
    icon: Sparkles,
    title: "Prompting Mastery",
    desc: "Write prompts that unlock 10× output.",
  },
  {
    icon: Bot,
    title: "AI Agents",
    desc: "Build autonomous workflows.",
  },
  {
    icon: TrendingUp,
    title: "Monetize",
    desc: "Turn skills into income streams.",
  },
  {
    icon: GraduationCap,
    title: "Certification",
    desc: "Earn recognized AI credentials.",
  },
];

export default function QuickActions() {
  return (
    <section className="relative mt-14 px-6 sm:mt-20">
      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
        Explore Tracks
      </h2>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {items.map((it) => (
          <button
            key={it.title}
            className="glass relative overflow-hidden rounded-2xl p-4 text-left transition-colors hover:bg-white/8"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--db-blue)]/15 blur-2xl" />
            <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
              <it.icon size={18} />
            </div>
            <h3 className="relative z-10 mt-3 text-sm font-semibold text-white">
              {it.title}
            </h3>
            <p className="relative z-10 mt-1 text-xs text-white/55">
              {it.desc}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
