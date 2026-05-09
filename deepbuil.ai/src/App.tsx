import { HashRouter, Route, Routes } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import TopBar from "./components/TopBar";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import WatchPage from "./pages/WatchPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { CoursesProvider } from "./store/CoursesContext";
import { AuthProvider } from "./store/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <CoursesProvider>
        <HashRouter>
          <div className="relative min-h-screen overflow-x-hidden bg-black text-white">
            <div className="pointer-events-none fixed inset-0 z-0">
              <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[var(--db-blue)]/8 blur-[140px]" />
            </div>

            <main className="relative z-10 mx-auto max-w-3xl pb-32">
              <TopBar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route
                  path="/watch/:id"
                  element={
                    <ProtectedRoute>
                      <WatchPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route
                  path="/tools"
                  element={
                    <PlaceholderPage
                      title="AI Tools"
                      subtitle="A growing library of AI tools to power your daily workflow."
                    />
                  }
                />
                <Route
                  path="/community"
                  element={
                    <PlaceholderPage
                      title="Community"
                      subtitle="Connect with thousands of builders learning AI alongside you."
                    />
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <PlaceholderPage
                        title="Profile"
                        subtitle="Track your progress, certificates, and learning streak."
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="*"
                  element={
                    <PlaceholderPage
                      title="Not Found"
                      subtitle="The page you're looking for doesn't exist."
                    />
                  }
                />
              </Routes>
            </main>

            <BottomNav />
          </div>
        </HashRouter>
      </CoursesProvider>
    </AuthProvider>
  );
}
