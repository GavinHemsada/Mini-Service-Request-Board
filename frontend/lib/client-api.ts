import { getPublicApiBase } from "./api-base";
import type { AuthUser, Job, JobStatus, PaginatedJobs } from "./types";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

async function parseJson(res: Response): Promise<unknown> {
  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { raw: text };
  }
}

function messageFromBody(body: unknown): string {
  if (body && typeof body === "object" && "error" in body) {
    const err = (body as { error?: unknown }).error;
    if (typeof err === "string") return err;
  }
  return "Request failed";
}

export async function apiRequest<T = unknown>(
  path: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<T> {
  const base = getPublicApiBase();
  const { token, headers: initHeaders, ...rest } = options;
  const headers = new Headers(initHeaders);
  if (!headers.has("Content-Type") && rest.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const res = await fetch(`${base}${path.startsWith("/") ? path : `/${path}`}`, {
    ...rest,
    headers,
  });
  const body = await parseJson(res);
  if (!res.ok) {
    throw new ApiError(messageFromBody(body), res.status, body);
  }
  return body as T;
}

export async function loginRequest(
  email: string,
  password: string
): Promise<{ token: string; user: AuthUser }> {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerRequest(
  email: string,
  password: string,
  name?: string
): Promise<{ token: string; user: AuthUser }> {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, name: name || undefined }),
  });
}

export async function createJobRequest(
  token: string,
  payload: {
    title: string;
    description: string;
    category: string;
    location: string;
    contactName: string;
    contactEmail: string;
  }
): Promise<Job> {
  return apiRequest("/api/jobs", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateJobStatusRequest(
  token: string,
  id: string,
  status: JobStatus
): Promise<Job> {
  return apiRequest(`/api/jobs/${encodeURIComponent(id)}`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ status }),
  });
}

export async function deleteJobRequest(token: string, id: string): Promise<void> {
  await apiRequest(`/api/jobs/${encodeURIComponent(id)}`, {
    method: "DELETE",
    token,
  });
}

export async function fetchMyJobsPaginated(
  token: string,
  params?: { page?: number; limit?: number; category?: string; status?: string; q?: string }
): Promise<PaginatedJobs> {
  const base = getPublicApiBase();
  const url = new URL("/api/jobs/mine", `${base}/`);
  if (params?.category) url.searchParams.set("category", params.category);
  if (params?.status) url.searchParams.set("status", params.status);
  if (params?.q) url.searchParams.set("q", params.q);
  if (params?.page && params.page > 1) url.searchParams.set("page", String(params.page));
  url.searchParams.set("limit", String(params?.limit ?? 12));
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  });
  const body = await parseJson(res);
  if (!res.ok) {
    throw new ApiError(messageFromBody(body), res.status, body);
  }
  return body as PaginatedJobs;
}
