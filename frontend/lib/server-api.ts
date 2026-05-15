import { getPublicApiBase } from "./api-base";
import type { Job, PaginatedJobs } from "./types";

const DEFAULT_LIMIT = 12;

function jobsUrl(
  path: string,
  params?: {
    category?: string;
    status?: string;
    q?: string;
    page?: number;
    limit?: number;
  }
) {
  const base = getPublicApiBase();
  const url = new URL(path, `${base}/`);
  if (params?.category) url.searchParams.set("category", params.category);
  if (params?.status) url.searchParams.set("status", params.status);
  if (params?.q) url.searchParams.set("q", params.q);
  if (params?.page && params.page > 1) url.searchParams.set("page", String(params.page));
  url.searchParams.set("limit", String(params?.limit ?? DEFAULT_LIMIT));
  return url.toString();
}

export async function fetchJobsPaginated(params?: {
  category?: string;
  status?: string;
  q?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedJobs> {
  const res = await fetch(jobsUrl("/api/jobs", params), { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to load jobs (${res.status})`);
  }
  return res.json() as Promise<PaginatedJobs>;
}

/** @deprecated use fetchJobsPaginated */
export async function fetchJobs(params?: {
  category?: string;
  status?: string;
  q?: string;
}): Promise<Job[]> {
  const result = await fetchJobsPaginated(params);
  return result.data;
}

export async function fetchJob(id: string): Promise<Job | null> {
  const base = getPublicApiBase();
  const res = await fetch(`${base}/api/jobs/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`Failed to load job (${res.status})`);
  }
  return res.json() as Promise<Job>;
}
