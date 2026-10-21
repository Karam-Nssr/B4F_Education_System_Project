export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, options);

  const result =
    response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      result &&
      typeof result === "object" &&
      "message" in result &&
      typeof result.message === "string"
        ? result.message
        : `HTTP error! status: ${response.status}`;

    throw new ApiError(message, response.status);
  }

  return result as T;
}

function buildHeaders(token?: string, hasBody = false): HeadersInit {
  return {
    ...(hasBody ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export const getData = <T = unknown>(url: string, token?: string): Promise<T> =>
  request<T>(url, {
    method: "GET",
    headers: buildHeaders(token),
  });

export const postData = <T = unknown>(
  url: string,
  data: unknown,
  token?: string,
): Promise<T> =>
  request<T>(url, {
    method: "POST",
    headers: buildHeaders(token, true),
    body: JSON.stringify(data),
  });

export const patchData = <T = unknown>(
  url: string,
  data: unknown,
  token?: string,
): Promise<T> =>
  request<T>(url, {
    method: "PATCH",
    headers: buildHeaders(token, true),
    body: JSON.stringify(data),
  });

export const deleteData = <T = unknown>(
  url: string,
  token?: string,
): Promise<T> =>
  request<T>(url, {
    method: "DELETE",
    headers: buildHeaders(token),
  });
