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
  const res = await getData<{ user: User } | User>(me_url, token);
  
  if ("user" in res) return res.user;
  return res as User;
}

export async function logout(token: string): Promise<void> {
  await postData(logout_url, {}, token);
}