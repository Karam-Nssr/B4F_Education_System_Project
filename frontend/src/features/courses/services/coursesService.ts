import { courses_url, enrollments_url } from "../../../../core/end_points";
import {
  getData,
  postData,
  deleteData,
  patchData,
} from "../../../../core/http_methods";

const getToken = () => localStorage.getItem("accessToken") || undefined;

export const fetchCourses = async (): Promise<any[]> => {
  try {
    const data: any = await getData(courses_url,getToken());
    console.log("Data received from backend:", data);
    if (data && Array.isArray(data.courses)) {
      return data.courses;
    } else if (Array.isArray(data)) {
      return data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error in fetchCourses:", error);
    return [];
  }
};

export const deleteCourse = async (id: string): Promise<void> => {
  await deleteData(`${courses_url}/${id}`, getToken());
};

export const enrollInCourse = async (
  courseId: string,
  studentId: string,
): Promise<void> => {
  await postData(enrollments_url, { courseId, studentId }, getToken());
};

export const getCourseById = async (id: string): Promise<any> => {
  const data: any = await getData(`${courses_url}/${id}`);
  return data.course || data;
};

export const createCourse = async (courseData: any): Promise<void> => {
  await postData(courses_url, courseData, getToken());
};

export const updateCourse = async (
  id: string,
  courseData: any,
): Promise<void> => {
  await patchData(`${courses_url}/${id}`, courseData, getToken());
};
