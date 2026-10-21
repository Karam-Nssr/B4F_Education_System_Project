import React, { useEffect, useState } from "react";
import {
  fetchCourses,
  deleteCourse,
  enrollInCourse,
  createCourse,
  updateCourse,
} from "../services/coursesService";
import { CourseCard } from "../components/CourseCard";
import { CourseModal } from "../components/CourseModal"; // تأكد من إنشاء هذا الملف

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // حالات النافذة المنبثقة
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);

  // محاكاة تسجيل الدخول كأدمن بصلاحيات كاملة
  const currentUser = {
    id: 101,
    name: "Abdulrahman",
    role: "admin",
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (err) {
      setError("Failed to connect to the server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(id);
        setCourses(courses.filter((course) => course.id !== id));
        alert("Course deleted successfully!");
      } catch (err) {
        alert("Error deleting course");
        console.error(err);
      }
    }
  };

  const handleEnroll = async (courseId: number) => {
    try {
      await enrollInCourse(courseId, currentUser.id);
      alert("Successfully enrolled in the course!");
    } catch (err) {
      alert("Error enrolling in course");
      console.error(err);
    }
  };

  // --- دوال النافذة المنبثقة ---
  const openCreateModal = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const openEditModal = (course: any) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (courseData: any) => {
    try {
      if (editingCourse) {
        await updateCourse(editingCourse.id, courseData);
        alert("Course updated successfully!");
      } else {
        await createCourse(courseData);
        alert("Course created successfully!");
      }
      setIsModalOpen(false);
      loadData(); // تحديث القائمة بعد الإضافة/التعديل
    } catch (err) {
      alert("Error saving course data");
      console.error(err);
    }
  };
  // -----------------------------

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-slate-600">
        Loading courses...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Course Management
          </h1>
          <div className="flex items-center gap-4">
            {/* زر إضافة كورس يظهر للأدمن فقط */}
            {currentUser.role === "admin" && (
              <button
                onClick={openCreateModal}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                + Add Course
              </button>
            )}
            <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200">
              <span className="text-sm text-slate-500">Logged in as: </span>
              <span className="font-bold text-indigo-600">
                {currentUser.name} ({currentUser.role})
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any) => (
            <CourseCard
              key={course.id}
              course={course}
              currentUser={currentUser}
              onDelete={handleDelete}
              onEnroll={handleEnroll}
              onEdit={openEditModal} // تم إضافة دالة التعديل هنا
            />
          ))}
        </div>
      </div>

      {/* استدعاء النافذة المنبثقة */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingCourse}
      />
    </div>
  );
};

export default CoursesPage;
