export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

interface ApiRequestParams<T> {
  endpoint: string;
  method: HttpMethod;
  data?: T;
  cache?: RequestCache;
}

export async function apiRequest<T, R = any>({
  endpoint,
  method,
  data,
  cache = "no-cache",
}: ApiRequestParams<T>): Promise<R> {
  // add cacjom
  const response = await fetch(endpoint, {
    method,
    headers: data ? { "Content-Type": "application/json" } : undefined,
    body: data ? JSON.stringify(data) : undefined,
    cache,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Request failed: ${method} ${endpoint}`
    );
  }

  return response.status !== 204 ? response.json() : undefined;
}
