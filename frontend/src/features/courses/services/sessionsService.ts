import { course_sessions_url } from "../../../../core/end_points";
import { getData, postData } from "../../../../core/http_methods";

const getToken = () => localStorage.getItem("token") || undefined;

// جلب الجلسات الخاصة بكورس معين
export const fetchSessions = async (courseId: string): Promise<any[]> => {
  try {
    const data: any = await getData(course_sessions_url(courseId), getToken());
    // بناءً على الباك إند الخاص بك، البيانات تعود داخل كائن data
    return data.data || [];
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
};

// إضافة جلسة جديدة للكورس
export const createSession = async (
  courseId: string,
  sessionData: any,
): Promise<void> => {
  await postData(course_sessions_url(courseId), sessionData, getToken());
};
