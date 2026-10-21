export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  role: "student" | "teacher" | "admin";
  status: "active" | "suspended";
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  role: "student" | "teacher";
};

export type AuthResponse = {
  message: string;
  token: string;
  user: User;
};

export type Enrollment = {
  _id: string;
  status: "pending" | "approved" | "rejected" | "suspended";
  student_id: { _id: string; first_name: string; last_name: string };
  course_id: { _id: string; title: string };
};
