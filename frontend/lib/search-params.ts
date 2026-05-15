export const JOBS_PAGE_SIZE = 12;

export type HomeListFilters = {
  category?: string;
  status?: string;
  q?: string;
  page?: number;
};

/** Build `/?category=…&status=…&q=…&page=…` for the home listing (matches GET /api/jobs query params). */
export function buildHomeQuery(params: HomeListFilters): string {
  const sp = new URLSearchParams();
  if (params.category) sp.set("category", params.category);
  if (params.status) sp.set("status", params.status);
  if (params.q) sp.set("q", params.q);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  const s = sp.toString();
  return s ? `/?${s}` : "/";
}

export function parsePageParam(raw?: string): number {
  const n = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export function homeFiltersFromSearchParams(sp: {
  category?: string;
  status?: string;
  q?: string;
}): { category: string; status: string; q: string } {
  return {
    category: sp.category?.trim() ?? "",
    status: sp.status?.trim() ?? "",
    q: sp.q?.trim() ?? "",
  };
}
