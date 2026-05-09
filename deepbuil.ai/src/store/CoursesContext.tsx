import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dbGet, dbSet } from "../lib/db";
import { initialModules, type Module } from "../data/modules";

type CoursesContextType = {
  modules: Module[];
  loading: boolean;
  addModule: (m: Module) => void;
  removeModule: (id: string) => void;
  getModule: (id: string) => Module | undefined;
};

const CoursesContext = createContext<CoursesContextType | null>(null);

const COURSES_KEY = "courses";
const INITED_KEY = "courses_initialized";

export function CoursesProvider({ children }: { children: ReactNode }) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount, seed if first time
  useEffect(() => {
    const wasInitialized = dbGet<boolean>(INITED_KEY, false);
    if (!wasInitialized) {
      dbSet(COURSES_KEY, initialModules);
      dbSet(INITED_KEY, true);
      setModules(initialModules);
    } else {
      const stored = dbGet<Module[]>(COURSES_KEY, initialModules);
      setModules(stored);
    }
    setLoading(false);
  }, []);

  // Persist any changes
  const persist = useCallback((updated: Module[]) => {
    setModules(updated);
    dbSet(COURSES_KEY, updated);
  }, []);

  const addModule = useCallback(
    (m: Module) => {
      persist([m, ...modules]);
    },
    [modules, persist],
  );

  const removeModule = useCallback(
    (id: string) => {
      persist(modules.filter((m) => m.id !== id));
    },
    [modules, persist],
  );

  const getModule = useCallback(
    (id: string) => modules.find((m) => m.id === id),
    [modules],
  );

  const value = useMemo(
    () => ({
      modules,
      loading,
      addModule,
      removeModule,
      getModule,
    }),
    [modules, loading, addModule, removeModule, getModule],
  );

  return (
    <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>
  );
}

export function useCourses() {
  const ctx = useContext(CoursesContext);
  if (!ctx) throw new Error("useCourses must be used within CoursesProvider");
  return ctx;
}
