import Hero from "../components/Hero";
import FeatureCard from "../components/FeatureCard";
import LearningModules from "../components/LearningModules";
import QuickActions from "../components/QuickActions";
import Logo from "../components/Logo";
import { Link } from "react-router-dom";
import { LogIn, LogOut, Settings } from "lucide-react";
import { useAuth } from "../store/AuthContext";

export default function HomePage() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  return (
    <>
      {/* Floating top brand row */}
      <div className="absolute inset-x-0 top-0 z-30">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 pt-4">
          <Logo size={24} />
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10"
              >
                <Settings size={14} />
                Admin
              </Link>
            )}
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10"
                title={user?.name}
              >
                <LogOut size={14} />
                Sign out
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black"
              >
                <LogIn size={14} />
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>

      <Hero />
      <div className="-mt-4">
        <FeatureCard />
      </div>
      <LearningModules />
      <QuickActions />

      <footer className="mt-16 px-6 pb-4 text-center">
        <p className="text-xs text-white/40">
          DeepBuild.ai · Crafted for the AI generation
        </p>
      </footer>
    </>
  );
}
