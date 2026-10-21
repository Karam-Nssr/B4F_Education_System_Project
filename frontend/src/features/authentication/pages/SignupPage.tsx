import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

function SignupPage() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"TEACHER" | "STUDENT">("STUDENT");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await registerUser({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        phone_number: phone,
        role: role === "TEACHER" ? "teacher" : "student", // PDF uses lowercase
      });
      navigate("/courses", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-slate-900">Create an account</h1>
        <p className="mt-2 text-sm text-slate-500">
          Join the Educational Management System.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-slate-700">
                First name
              </label>
              <input
                id="firstName" type="text" value={firstName}
                onChange={(e) => setFirstName(e.target.value)} required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-slate-700">
                Last name
              </label>
              <input
                id="lastName" type="text" value={lastName}
                onChange={(e) => setLastName(e.target.value)} required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input
              id="email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)} required
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">Phone number</label>
            <input
              id="phone" type="tel" value={phone}
              onChange={(e) => setPhone(e.target.value)} required
              placeholder="963911111111"
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input
              id="password" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required minLength={8}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label htmlFor="role" className="mb-2 block text-sm font-medium text-slate-700">Account type</label>
            <select
              id="role" value={role}
              onChange={(e) => setRole(e.target.value as "TEACHER" | "STUDENT")}
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
            </select>
          </div>

          {error && (
            <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit" disabled={isSubmitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {isSubmitting ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;