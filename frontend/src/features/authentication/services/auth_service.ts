import { login_url, register_url, me_url, logout_url } from "../../../../core/end_points";
import { getData, postData } from "../../../../core/http_methods";
import type { LoginCredentials, RegisterPayload, User, AuthResponse } from "../types";

export async function login(credentials: LoginCredentials) {
  const res = await postData<AuthResponse>(login_url, credentials);
  return { token: res.token, user: res.user };
}

export async function register(payload: RegisterPayload) {
  const res = await postData<AuthResponse>(register_url, payload);
  return { token: res.token, user: res.user };
}

export async function getCurrentUser(token: string): Promise<User> {
  try {
    const res = await getData<any>(me_url, token);
    if (res.user) return res.user;
    if (res.data) return res.data;
    return res;
  } catch (error) {
    console.error("Failed to get current user:", error);
    throw error;
  }
}

export async function logout(token: string): Promise<void> {
  await postData(logout_url, {}, token);
}