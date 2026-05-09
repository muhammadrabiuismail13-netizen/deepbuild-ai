import { Link } from "react-router-dom";
import ModuleCard from "./ModuleCard";
import { useCourses } from "../store/CoursesContext";

export default function LearningModules() {
  const { modules } = useCourses();

  return (
    <section className="relative mt-12 sm:mt-16">
      <div className="flex items-end justify-between px-6">
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Learning Modules
        </h2>
        <Link
          to="/courses"
          className="text-base font-semibold text-[var(--db-blue-soft)] transition-colors hover:text-white"
        >
          See all
        </Link>
      </div>

      <div className="no-scrollbar mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4">
        {modules.map((m) => (
          <ModuleCard key={m.id} module={m} variant="carousel" />
        ))}
        <div className="w-2 flex-shrink-0" />
      </div>
    </section>
  );
}
