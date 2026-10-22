import React, { useState, useEffect } from "react";
import { fetchSessions, createSession } from "../services/sessionsService";

interface SessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string | null;
}

export const SessionModal: React.FC<SessionModalProps> = ({
  isOpen,
  onClose,
  courseId,
}) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Add new session fields
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  // Fetch sessions when the modal opens
  useEffect(() => {
    if (isOpen && courseId) {
      loadSessions();
    }
  }, [isOpen, courseId]);

  const loadSessions = async () => {
    setLoading(true);
    const data = await fetchSessions(courseId!);
    setSessions(data);
    setLoading(false);
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;

    try {
      await createSession(courseId, { content: title, session_date: date });
      // Reset fields and refresh list after adding
      setTitle("");
      setDate("");
      loadSessions();
    } catch (error) {
      console.error("Failed to add session");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manage Course Sessions</h2>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-red-700 font-bold"
          >
            X
          </button>
        </div>

        {/* Add New Session Form */}
        <form
          onSubmit={handleAddSession}
          className="mb-6 p-4 bg-slate-50 rounded-lg border"
        >
          <h3 className="font-semibold mb-2">Add New Session</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Session Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Add Session
          </button>
        </form>

        {/* Current Sessions List */}
        <div>
          <h3 className="font-semibold mb-2">Current Sessions</h3>
          {loading ? (
            <p className="text-slate-500">Loading...</p>
          ) : sessions.length > 0 ? (
            <ul className="space-y-2">
              {sessions.map((session, index) => (
                <li
                  key={session.id || index}
                  className="p-3 border rounded flex justify-between items-center bg-white shadow-sm"
                >
                  <span className="font-medium text-slate-800">
                    {session.title || `Session ${index + 1}`}
                  </span>
                  <span className="text-sm text-slate-500">{session.date}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-500 text-sm">
              No sessions added to this course yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
