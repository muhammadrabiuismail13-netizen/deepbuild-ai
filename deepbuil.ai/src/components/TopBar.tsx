import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogIn, LogOut, Settings } from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../store/AuthContext";

export default function TopBar() {
  const { pathname } = useLocation();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-40 glass-strong">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-3">
        <Link to="/" aria-label="DeepBuild.ai home">
          <Logo size={26} />
        </Link>

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
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10"
              title={user?.email}
            >
              <LogOut size={14} />
              Sign out
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-black transition-opacity hover:opacity-90"
            >
              <LogIn size={14} />
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
