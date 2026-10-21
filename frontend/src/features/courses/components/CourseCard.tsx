import React from "react";

interface CourseCardProps {
  course: any;
  currentUser: any;
  onDelete: (id: number) => void;
  onEnroll: (courseId: number) => void;
  onEdit: (course: any) => void; // دالة لفتح نافذة التعديل مع تمرير بيانات الكورس
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  currentUser,
  onDelete,
  onEnroll,
  onEdit,
}) => {
  // منطق الصلاحيات
  const isAdmin = currentUser.role === "admin";
  const isStudent = currentUser.role === "student";
  const isCourseOwner =
    currentUser.role === "instructor" && course.instructorId === currentUser.id;

  // يحق التعديل للأدمن أو لمالك الكورس
  const canEdit = isAdmin || isCourseOwner;

  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200 flex flex-col overflow-hidden">
      {/* الصورة */}
      <div className="w-full h-48 overflow-hidden bg-slate-100">
        <img
          src={
            course.image ||
            "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=80"
          }
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-6 flex flex-col justify-between flex-1">
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Course
            </span>
            {/* <span className="text-slate-400 text-sm font-medium">
              {course.id}#
            </span> */}
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2 leading-snug group-hover:text-indigo-600 transition-colors">
            {course.title}
          </h2>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span className="font-medium text-slate-500">Instructor:</span>
            <span className="font-semibold text-slate-800">
              {course.instructor}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span className="font-medium text-slate-500">Duration:</span>
            <span className="font-semibold text-slate-800">
              {course.duration}
            </span>
          </div>
        </div>

        {/* قسم الأزرار المشروطة مع تفعيل الوظائف */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
          {isStudent && (
            <button
              onClick={() => onEnroll(course.id)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Enroll Now
            </button>
          )}

          {canEdit && (
            <button
              onClick={() => onEdit(course)} // يفتح النافذة ويمرر لها بيانات الكورس الحالي
              className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-700 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Edit
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => onDelete(course.id)}
              className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
