import React, { useEffect, useState } from "react";
import {
  fetchCourses,
  deleteCourse,
  enrollInCourse,
  createCourse,
  updateCourse,
} from "../services/coursesService";
import { CourseCard } from "../components/CourseCard";
import { CourseModal } from "../components/CourseModal";
import { SessionModal } from "../components/SessionModal";
import { useAuth } from "../../../../context/AuthContext";

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);

  const [isSessionModalOpen, setIsSessionModalOpen] = useState<boolean>(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const { user: currentUser } = useAuth();

  const loadData = async () => {
    try {
      const data = await fetchCourses();
      const coursesList = Array.isArray(data)
        ? data
        : (data as any).courses || [];
      setCourses(coursesList);
    } catch (err) {
      setError("Failed to connect to the server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(id);
        setCourses(courses.filter((course) => course.id !== id));
      } catch (err) {
        alert("Error deleting course");
        console.error(err);
      }
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!currentUser) {
      alert("Please login first to enroll.");
      return;
    }
    try {
      await enrollInCourse(
        courseId,
        currentUser.id || (currentUser as any)._id,
      );
      alert("Successfully requested enrollment!");
    } catch (err) {
      alert("Error enrolling in course");
      console.error(err);
    }
  };

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
      loadData();
    } catch (err) {
      alert("Error saving course data");
      console.error(err);
    }
  };

  const handleOpenSessions = (courseId: string) => {
    setSelectedCourseId(courseId);
    setIsSessionModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-blue-600 font-medium">
        <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Loading Courses...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Course Catalog
            </h1>
            <p className="text-slate-500 mt-1">
              Browse and manage available learning materials.
            </p>
          </div>

          {currentUser?.role === "admin" && (
            <button
              onClick={openCreateModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-colors"
            >
              + Add New Course
            </button>
          )}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: any) => (
            <CourseCard
              key={course.id || course._id}
              course={course}
              currentUser={currentUser}
              onDelete={handleDelete}
              onEnroll={handleEnroll}
              onEdit={openEditModal}
              onOpenSessions={handleOpenSessions}
            />
          ))}
        </div>
      </div>

      <CourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingCourse}
      />

      <SessionModal
        isOpen={isSessionModalOpen}
        onClose={() => setIsSessionModalOpen(false)}
        courseId={selectedCourseId}
      />
    </div>
  );
};

export default CoursesPage;
