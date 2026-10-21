export type UserRole = "ADMIN" | "TEACHER" | "STUDENT";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
    user: User;
  };
}
