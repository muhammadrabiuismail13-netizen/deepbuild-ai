import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ModuleCard from "../components/ModuleCard";
import { useCourses } from "../store/CoursesContext";

const FILTERS = ["All", "Foundations", "Entrepreneurship", "Creator Studio", "Productivity"];

export default function CoursesPage() {
  const { modules } = useCourses();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    return modules.filter((m) => {
      const matchesFilter = filter === "All" || m.category === filter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [modules, filter, query]);

  return (
    <div className="px-5 pt-4 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        Courses
      </h1>
      <p className="mt-2 max-w-xl text-sm text-white/55">
        Hand-crafted learning paths for the AI generation. Master tools,
        workflows, and businesses powered by AI.
      </p>

      {/* Search */}
      <div className="mt-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2.5">
        <Search size={16} className="text-white/50" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses, topics, or skills"
          className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
        />
      </div>

      {/* Filter chips */}
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                active
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-white/75 hover:bg-white/10"
              }`}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {filtered.map((m) => (
          <ModuleCard key={m.id} module={m} variant="grid" />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-white/50">No courses match your filters.</p>
        </div>
      )}
    </div>
  );
}
