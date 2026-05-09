import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  loginUser,
  createUser,
  setSession,
  getSession,
  clearSession,
} from "../lib/db";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const s = getSession();
    if (s) setUser({ id: s.id, name: s.name, email: s.email, role: s.role });
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = loginUser(email, password);
    setSession(u);
    setUser({ id: u.id, name: u.name, email: u.email, role: u.role });
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const u = createUser(name, email, password);
      setSession(u);
      setUser({ id: u.id, name: u.name, email: u.email, role: u.role });
    },
    [],
  );

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      login,
      signup,
      logout,
    }),
    [user, loading, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
