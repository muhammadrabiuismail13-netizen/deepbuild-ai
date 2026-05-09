import { Home, BookOpen, Sparkles, Users, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/courses", label: "Courses", icon: BookOpen, end: false },
  { to: "/tools", label: "AI Tools", icon: Sparkles, end: false },
  { to: "/community", label: "Community", icon: Users, end: false },
  { to: "/profile", label: "Profile", icon: User, end: false },
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50">
      <div className="pointer-events-none h-8 bg-gradient-to-t from-black to-transparent" />
      <div className="glass-strong px-2 pt-2 pb-[max(env(safe-area-inset-bottom),12px)]">
        <div className="mx-auto flex max-w-2xl items-center justify-around">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `relative flex flex-1 flex-col items-center justify-center gap-1 py-1.5 ${
                  isActive ? "text-[var(--db-blue-soft)]" : "text-white/55"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <t.icon size={22} strokeWidth={isActive ? 2.4 : 2} />
                  <span className="text-[10px] font-medium tracking-tight">
                    {t.label}
                  </span>
                  {isActive && (
                    <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-[var(--db-blue-soft)]" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
