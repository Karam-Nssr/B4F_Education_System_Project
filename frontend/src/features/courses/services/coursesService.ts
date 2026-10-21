export const fetchCourses = async (): Promise<any[]> => {
  const response = await fetch("http://localhost:3000/courses");
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  return response.json();
};

export const deleteCourse = async (id: number): Promise<void> => {
  const response = await fetch(`http://localhost:3000/courses/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete course");
  }
};

export const enrollInCourse = async (
  courseId: number,
  studentId: number,
): Promise<void> => {
  const response = await fetch("http://localhost:3000/enrollments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseId, studentId }),
  });
  if (!response.ok) {
    throw new Error("Failed to enroll in course");
  }
};
export const getCourseById = async (id: number): Promise<any> => {
  const response = await fetch(`http://localhost:3000/courses/${id}`);
  if (!response.ok) throw new Error("Failed to fetch course");
  return response.json();
};

export const createCourse = async (courseData: any): Promise<void> => {
  const response = await fetch("http://localhost:3000/courses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(courseData),
  });
  if (!response.ok) throw new Error("Failed to create course");
};

export const updateCourse = async (id: number, courseData: any): Promise<void> => {
  const response = await fetch(`http://localhost:3000/courses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(courseData),
  });
  if (!response.ok) throw new Error("Failed to update course");
};