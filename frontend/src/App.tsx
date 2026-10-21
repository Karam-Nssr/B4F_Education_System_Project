import { Navigate, Route, Routes } from "react-router-dom";
import CoursesPage from "./features/courses/pages/CoursesPage";
import LoginPage from "./features/authentication/pages/LoginPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<h1>Dashboard</h1>} />
      <Route path="/students" element={<h1>Students</h1>} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/" element={<Navigate to="/courses" replace />} />
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
