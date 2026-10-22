import { Link } from "react-router-dom";

function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-3xl font-bold text-white shadow-lg shadow-blue-200">
            E
          </div>
          <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Edu<span className="text-blue-600">Flow</span>
          </span>
        </div>

        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          Education Management System
        </h1>

        <p className="text-lg text-slate-600 mb-10 max-w-lg">
          Manage students, teachers, courses, and attendance seamlessly in one
          integrated, modern platform.
        </p>

        <div className="flex gap-4 w-full sm:w-auto flex-col sm:flex-row">
          <Link
            to="/login"
            className="rounded-xl bg-blue-600 px-8 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all w-full sm:w-auto text-center"
          >
            Sign In to Platform
          </Link>

          <Link
            to="/signup"
            className="rounded-xl border-2 border-slate-200 bg-white px-8 py-3.5 font-semibold text-slate-700 hover:border-blue-600 hover:text-blue-600 transition-all w-full sm:w-auto text-center"
          >
            Create Student Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
