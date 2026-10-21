import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { getData, postData, patchData } from "../../../../core/http_methods";
import {
  users_url,
  users_deactivate_url,
  enrollments_url,
  enrollment_status_url,
} from "../../../../core/end_points";
import type { User, Enrollment } from "../types";

export default function AdminDashboard() {
  const { token, logout } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  const [error, setError] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function fetchUsers() {
    try {
      setLoadingUsers(true);
      const res = await getData<{ users: User[] }>(users_url, token!);
      setUsers(res.users);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingUsers(false);
    }
  }

  async function fetchEnrollments() {
    try {
      setLoadingEnrollments(true);
      const res = await getData<Enrollment[]>(enrollments_url, token!);
      setEnrollments(res);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingEnrollments(false);
    }
  }

  useEffect(() => {
    fetchUsers();
    fetchEnrollments();
  }, []);

  async function handleCreateTeacher(e: FormEvent) {
    e.preventDefault();
    try {
      await postData(
        users_url,
        {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          role: "teacher",
          phone_number: "0000000000",
        },
        token!,
      );

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function toggleUserStatus(userId: string, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      await patchData(
        users_deactivate_url(userId),
        { status: newStatus },
        token!,
      );
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleUpdateEnrollmentStatus(id: string, newStatus: string) {
    try {
      await patchData(enrollment_status_url(id), { status: newStatus }, token!);
      fetchEnrollments();
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </header>

        {error && (
          <div className="rounded bg-red-100 p-4 text-red-700">{error}</div>
        )}

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-800">
            Add New Teacher
          </h2>
          <form
            onSubmit={handleCreateTeacher}
            className="grid grid-cols-1 gap-4 md:grid-cols-4"
          >
            <input
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="rounded border p-2"
            />
            <input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="rounded border p-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded border p-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded border p-2"
            />
            <button
              type="submit"
              className="md:col-span-4 rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
            >
              Create Teacher Account
            </button>
          </form>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-800">All Users</h2>

          {loadingUsers ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-slate-100">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-slate-50">
                    <td className="p-3">
                      {u.first_name} {u.last_name}
                    </td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3 capitalize">{u.role}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${u.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleUserStatus(u.id, u.status)}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-900"
                      >
                        {u.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-800">
            Manage Enrollments
          </h2>

          {loadingEnrollments ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-slate-100">
                  <th className="p-3">Student</th>
                  <th className="p-3">Course</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((e) => (
                  <tr key={e._id} className="border-b hover:bg-slate-50">
                    <td className="p-3">
                      {e.student_id?.first_name} {e.student_id?.last_name}
                    </td>
                    <td className="p-3">{e.course_id?.title}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold 
                        ${
                          e.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : e.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="p-3 flex gap-2">
                      {e.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateEnrollmentStatus(e._id, "approved")
                            }
                            className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateEnrollmentStatus(e._id, "rejected")
                            }
                            className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {e.status !== "pending" && (
                        <span className="text-xs text-slate-400 italic">
                          No actions available
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {enrollments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-500">
                      No enrollment requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
