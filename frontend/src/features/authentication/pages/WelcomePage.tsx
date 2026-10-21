
import { Link } from "react-router-dom";

function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <h1 className="text-4xl font-bold text-slate-900">
        Education Management System
      </h1>

      <p className="mt-4 text-slate-600">
        Manage students, teachers, and courses in one place.
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          to="/login"
          className="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          Sign In
        </Link>

        <Link
          to="/signup"
          className="rounded-lg border border-indigo-600 px-6 py-3 font-semibold text-indigo-600 hover:bg-indigo-50"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default WelcomePage;
