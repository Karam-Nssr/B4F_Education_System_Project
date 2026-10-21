import { Route, Routes } from "react-router-dom";
import CoursesPage from "./features/courses/pages/CoursesPage";
import LoginPage from "./features/authentication/pages/LoginPage";
import WelcomePage from "./features/authentication/pages/WelcomePage";
import SignupPage from "./features/authentication/pages/SignupPage";
import AdminDashboard from "./features/authentication/pages/AdminDashboard";
import AdminRoute from "./features/authentication/guards/AdminRouteGuard";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/students" element={<h1>Students</h1>} />
      <Route path="/courses" element={<CoursesPage/>}/>
      <Route path="/" element={<WelcomePage />} />
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      <Route element={<AdminRoute />}>
            <Route path="/dashboard" element={<AdminDashboard />} />
          </Route>
    </Routes>
  );
}

export default App;
