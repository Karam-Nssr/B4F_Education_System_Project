import { login_url, me_url, logout_url } from "../../../../core/end_points";
import { getData, postData } from "../../../../core/http_methods";
import type { LoginCredentials, LoginResponse, User } from "../types";

export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  return postData<LoginResponse>(login_url, credentials);
}

export async function getCurrentUser(token: string): Promise<User> {
  const response = await getData<{ success: boolean; data: User }>(
    me_url,
    token,
  );

  return response.data;
}

export async function logout(token: string): Promise<void> {
  await postData(logout_url, {}, token);
}
