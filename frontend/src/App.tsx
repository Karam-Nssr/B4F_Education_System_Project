import { Navigate, Route, Routes } from "react-router-dom";
import CoursesPage from "./features/courses/pages/CoursesPage";
import LoginPage from "./features/authentication/pages/LoginPage";
import WelcomePage from "./features/authentication/pages/WelcomePage";
import SignupPage from "./features/authentication/pages/SignupPage";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/students" element={<h1>Students</h1>} />
      <Route path="/courses" element={<CoursesPage/>}/>
      <Route path="/" element={<WelcomePage />} />
      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}

export default App;
