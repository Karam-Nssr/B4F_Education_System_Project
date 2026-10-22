export const base_url = "http://localhost:5000";

export const login_url = `${base_url}/login`;
export const register_url = `${base_url}/register`;

export const users_url = `${base_url}/users`;
export const courses_url = `${base_url}/courses`;
export const enrollments_url = `${base_url}/enrollments`;
export const enrollment_status_url = (id: string) => `${enrollments_url}/${id}/status`;
export const me_url       = `${base_url}/profile`
export const logout_url = `${base_url}/logout`;
export const users_profile_url = `${users_url}/profile`;
export const users_admin_url = `${users_url}/admin`;
export const users_deactivate_url = (id: string) =>
  `${users_url}/${id}/deactivate`;
export const course_sessions_url = (courseId: string) =>
  `${courses_url}/${courseId}/sessions`;
