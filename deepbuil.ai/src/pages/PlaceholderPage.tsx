import { Clock } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  title: string;
  subtitle: string;
};

export default function PlaceholderPage({ title, subtitle }: Props) {
  return (
    <div className="px-6 pt-6">
      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 max-w-xl text-sm text-white/55">{subtitle}</p>

      <div className="mt-10 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-16 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--db-blue)]/15">
          <Clock size={24} className="text-[var(--db-blue-soft)]" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-white">
          Coming Soon
        </h2>
        <p className="mt-2 max-w-sm text-sm text-white/55">
          We're building something amazing. This section will be available in an
          upcoming update.
        </p>
        <Link
          to="/courses"
          className="mt-6 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          Browse Courses Instead
        </Link>
      </div>
    </div>
  );
}
