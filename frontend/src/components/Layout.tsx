import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            <span className="text-xl font-bold text-indigo-600">EduManage</span>
            
            <div className="flex gap-4">
              {user?.role === "admin" && (
                <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 font-medium">
                  Admin Dashboard
                </Link>
              )}
              <Link to="/courses" className="text-slate-600 hover:text-indigo-600 font-medium">
                Courses
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">
              {user?.first_name} ({user?.role})
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        <Outlet /> 
      </main>
    </div>
  );
}