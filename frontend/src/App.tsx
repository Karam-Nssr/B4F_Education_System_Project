import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext"; 
import ProtectedRoute from "./features/authentication/guards/ProtectedRoute";
import AdminRoute from "./features/authentication/guards/AdminRouteGuard";

import LoginPage from "./features/authentication/pages/LoginPage";
import SignupPage from "./features/authentication/pages/SignupPage";
import AdminDashboard from "./features/authentication/pages/AdminDashboard";
import CoursesPage from "./features/courses/pages/CoursesPage";
import Layout from "./components/Layout";
import WelcomePage from "./features/authentication/pages/WelcomePage";

function RootRedirect() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (user) {
    return <Navigate to={user.role === "admin" ? "/dashboard" : "/courses"} replace />;
  }
  return <WelcomePage />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}> 
              <Route path="/courses" element={<CoursesPage />} />

              <Route element={<AdminRoute />}>
                <Route path="/dashboard" element={<AdminDashboard />} />
              </Route>
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}