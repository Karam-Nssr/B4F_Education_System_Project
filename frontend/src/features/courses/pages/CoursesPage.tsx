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
// استيراد أدوات جلب بيانات المستخدم
import { me_url } from "../../../../core/end_points";
import { getData } from "../../../../core/http_methods";
import { useAuth } from "../../../../context/AuthContext";
const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // حالة المستخدم الحالي (تبدأ فارغة حتى يتم جلب البيانات)
  // const [currentUser, setCurrentUser] = useState<any | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);

  const [isSessionModalOpen, setIsSessionModalOpen] = useState<boolean>(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const { user: currentUser, isLoading: authLoading } = useAuth();
  
  const loadData = async () => {
    try {
      const data = await fetchCourses();
      const coursesList = Array.isArray(data) ? data : (data as any).courses || [];
      setCourses(coursesList);
    } catch (err) {
      setError("Failed to connect to the server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // دالة لجلب بيانات المستخدم والكورسات معاً عند فتح الصفحة
    const initializePage = async () => {
      // try {
      //   const token = localStorage.getItem("accessToken");

      //   if (token) {
      //     // جلب بيانات المستخدم باستخدام التوكن
      //     // const userData: any = await getData(me_url, token);
      //      // افترضنا أن الباك إند يعيد البيانات داخل user، عدلها إذا كان يعيدها مباشرة
      //     // setCurrentUser(userData.user || userData.data || userData);
      //   } else {
      //     // إذا لم يكن هناك توكن، يمكنك توجيهه لصفحة تسجيل الدخول
      //     console.warn("No token found. User is not logged in.");
      //   }
      // } catch (err) {
      //   console.error("Failed to fetch user profile", err);
      // }

      // جلب الكورسات بعد التحقق من المستخدم
      await loadData();
    };

    initializePage();
  }, []);

  const handleDelete = async (id: string) => {
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

  const handleEnroll = async (courseId: string) => {
    if (!currentUser) {
      alert("Please login first to enroll.");
      return;
    }
    try {
      await enrollInCourse(courseId, currentUser.id || currentUser._id);
      alert("Successfully enrolled in the course!");
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-slate-600">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );

  // إذا لم يتم تسجيل الدخول بعد (ولا نريد عرض الصفحة بدونه)
  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-screen text-slate-600">
        Please log in to view this page.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Course Management
          </h1>
          <div className="flex items-center gap-4">
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
                {currentUser.first_name || currentUser.username} ({currentUser.role})
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
