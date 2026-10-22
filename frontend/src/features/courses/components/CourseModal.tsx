import React, { useState, useEffect } from "react";
import { fetchTeachers } from "../services/coursesService";

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
}

// 1. التعديل هنا: مطابقة الأسماء تماماً مع الباك اند (first_name و last_name)
interface Instructor {
  _id?: string;
  id?: string;
  first_name: string;
  last_name: string;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    teacher: "",
    duration_hours: "",
    image: "",
  });

  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ title: "", teacher: "", duration_hours: "", image: "" });
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    const loadInstructors = async () => {
      if (!isOpen) return;

      setIsLoading(true);
      try {
        const teachers = await fetchTeachers();
        setInstructors(teachers);
      } catch (error) {
        console.error("Error loading instructors:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInstructors();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          {initialData ? "Edit Course" : "Create New Course"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Course Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Instructor Name
            </label>
            <select
              name="teacher"
              value={formData.teacher}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              <option value="" disabled>
                {isLoading ? "Loading instructors..." : "Select an instructor"}
              </option>
              {instructors.map((inst, index) => {
                // نأخذ الـ ID سواء كان اسمه _id أو id
                const teacherId = inst._id || inst.id;
                return (
                  <option key={teacherId || index} value={teacherId}>
                    {inst.first_name} {inst.last_name}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Duration
            </label>
            <input
              type="text"
              name="duration_hours"
              value={formData.duration_hours}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex gap-3 pt-4 mt-6 border-t border-slate-100">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {initialData ? "Save Changes" : "Create"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-100 text-slate-700 font-medium py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
