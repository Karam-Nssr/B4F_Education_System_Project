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
  const { token } = useAuth();

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
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Manage users, staff, and course enrollments.
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-200 text-red-700">
            {error}
          </div>
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
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="md:col-span-4 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              Create Teacher Account
            </button>
          </form>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">System Users</h2>
          </div>
          {loadingUsers ? (
            <div className="p-6 text-slate-500">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4 font-medium text-slate-900">
                        {u.first_name} {u.last_name}
                      </td>
                      <td className="p-4 text-slate-500">{u.email}</td>
                      <td className="p-4 capitalize text-slate-600">
                        {u.role}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleUserStatus(u.id, u.status)}
                          className={`text-sm font-semibold ${u.status === "active" ? "text-red-600 hover:text-red-800" : "text-green-600 hover:text-green-800"}`}
                        >
                          {u.status === "active" ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800">
              Manage Enrollments
            </h2>
          </div>

          {loadingEnrollments ? (
            <div className="p-6 text-slate-500">Loading enrollments...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="p-4 font-semibold">Student</th>
                    <th className="p-4 font-semibold">Course</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {enrollments.map((e) => (
                    <tr
                      key={e._id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4 font-medium text-slate-900">
                        {e.student_id?.first_name} {e.student_id?.last_name}
                      </td>
                      <td className="p-4 text-slate-600">
                        {e.course_id?.title}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
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
                      <td className="p-4 flex gap-2">
                        {e.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateEnrollmentStatus(e._id, "approved")
                              }
                              className="rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleUpdateEnrollmentStatus(e._id, "rejected")
                              }
                              className="rounded bg-white border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {e.status !== "pending" && (
                          <span className="text-xs text-slate-400 italic">
                            Reviewed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {enrollments.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-8 text-center text-slate-500"
                      >
                        No enrollment requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
