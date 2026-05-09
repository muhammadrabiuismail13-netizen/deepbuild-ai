import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { useAuth } from "../store/AuthContext";

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as {
    state?: { from?: { pathname: string } };
  };
  const redirectTo = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-5 pt-10 sm:px-6">
      <div className="mx-auto max-w-md">
        <div className="flex justify-center">
          <Logo size={32} />
        </div>
        <h1 className="mt-8 text-center text-3xl font-bold tracking-tight text-white">
          Welcome back
        </h1>
        <p className="mt-2 text-center text-sm text-white/55">
          Sign in to continue your AI journey.
        </p>

        {/* Admin credentials hint */}
        <div className="mt-4 rounded-xl border border-[var(--db-blue)]/30 bg-[var(--db-blue)]/10 px-4 py-3 text-sm text-white/80">
          <p className="font-semibold text-[var(--db-blue-soft)]">
            Admin credentials:
          </p>
          <p className="mt-1 font-mono text-xs">
            Email: admin@deepbuild.ai
            <br />
            Password: admin123
          </p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
              Email
            </span>
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[var(--db-blue)]/60 focus:outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
              Password
            </span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-[var(--db-blue)]/60 focus:outline-none"
            />
          </label>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-white py-2.5 text-sm font-semibold text-black transition-opacity disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/55">
          New to DeepBuild?{" "}
          <Link
            to="/signup"
            className="font-semibold text-[var(--db-blue-soft)] hover:text-white"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
