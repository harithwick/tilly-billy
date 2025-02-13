export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export async function apiRequest<T>(
  endpoint: string,
  method: HttpMethod,
  data?: any
): Promise<T> {
  const response = await fetch(endpoint, {
    method,
    headers: data ? { "Content-Type": "application/json" } : undefined,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Request failed: ${method} ${endpoint}`
    );
  }

  return response.status !== 204 ? response.json() : undefined;
}
