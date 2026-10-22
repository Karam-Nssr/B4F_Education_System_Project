import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path
        ? "bg-blue-100 text-blue-700"
        : "text-slate-600 hover:text-blue-600 hover:bg-slate-100"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* EduFlow Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white shadow-sm">
                E
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                Edu<span className="text-blue-600">Flow</span>
              </span>
            </Link>

            <div className="hidden md:flex gap-2">
              {user?.role === "admin" && (
                <Link to="/dashboard" className={navLinkClass("/dashboard")}>
                  Admin Dashboard
                </Link>
              )}
              <Link to="/courses" className={navLinkClass("/courses")}>
                Courses
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-sm font-semibold text-slate-800">
                {user?.first_name} {user?.last_name}
              </span>
              <span className="text-xs text-blue-600 font-medium capitalize">
                {user?.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
}
