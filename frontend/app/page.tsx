import { Suspense } from "react";
import { HomeToolbar } from "@/components/home-toolbar";
import { JobCard } from "@/components/job-card";
import { JobsPagination } from "@/components/jobs-pagination";
import { fetchJobsPaginated } from "@/lib/server-api";
import { homeFiltersFromSearchParams, JOBS_PAGE_SIZE, parsePageParam } from "@/lib/search-params";
import type { Job, JobsPagination as JobsPaginationMeta } from "@/lib/types";

export const dynamic = "force-dynamic";

type Search = { category?: string; status?: string; q?: string; page?: string };

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;
  const { category, status, q } = homeFiltersFromSearchParams(sp);
  const page = parsePageParam(sp.page);

  let jobs: Job[] = [];
  let pagination: JobsPaginationMeta = {
    page: 1,
    limit: JOBS_PAGE_SIZE,
    total: 0,
    totalPages: 0,
  };
  let error: string | null = null;

  try {
    const result = await fetchJobsPaginated({
      ...(category ? { category } : {}),
      ...(status ? { status } : {}),
      ...(q ? { q } : {}),
      page,
      limit: JOBS_PAGE_SIZE,
    });
    jobs = result.data;
    pagination = result.pagination;
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load jobs.";
    jobs = [];
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Open service requests
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-600 dark:text-zinc-400">
          Browse homeowner requests {JOBS_PAGE_SIZE} per page. Use Next for more.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="h-24 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-900" aria-hidden />
        }
      >
        <HomeToolbar category={category} status={status} />
      </Suspense>

      {error ? (
        <div
          className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100"
          role="alert"
        >
          <p className="font-medium">Unable to reach the API</p>
          <p className="mt-1 text-amber-800 dark:text-amber-200">{error}</p>
        </div>
      ) : null}

      {!error && jobs.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 px-4 py-12 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:text-zinc-400">
          No requests match your filters on this page.
        </p>
      ) : null}

      {!error && jobs.length > 0 ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {jobs.map((job) => (
            <li key={job._id}>
              <JobCard job={job} />
            </li>
          ))}
        </ul>
      ) : null}

      {!error && pagination.total > 0 ? (
        <JobsPagination
          pagination={pagination}
          category={category || undefined}
          status={status || undefined}
          q={q || undefined}
        />
      ) : null}
    </div>
  );
}
