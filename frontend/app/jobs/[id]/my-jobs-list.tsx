"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { JobCard } from "@/components/job-card";
import { ApiError, fetchMyJobsPaginated } from "@/lib/client-api";
import type { Job, JobsPagination } from "@/lib/types";

function parsePage(raw: string | null): number {
  const n = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export function MyJobsList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parsePage(searchParams.get("page"));
  const { token, ready } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pagination, setPagination] = useState<JobsPagination | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMyJobsPaginated(token, { page, limit: 12 });
      setJobs(result.data);
      setPagination(result.pagination);
    } catch (e) {
      if (e instanceof ApiError) setError(e.message);
      else setError("Failed to load your requests.");
      setJobs([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [token, page]);

  useEffect(() => {
    if (!ready) return;
    if (!token) {
      router.replace(`/login?next=${encodeURIComponent("/jobs/mine")}`);
      return;
    }
    load();
  }, [ready, token, router, load]);

  if (!ready || !token) {
    return <p className="text-sm text-zinc-500">Loading your account…</p>;
  }

  if (loading) {
    return <p className="text-sm text-zinc-500">Loading your requests…</p>;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {pagination ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          You have posted <span className="font-semibold text-zinc-900 dark:text-zinc-100">{pagination.total}</span>{" "}
          request{pagination.total === 1 ? "" : "s"}.
        </p>
      ) : null}

      {jobs.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 px-4 py-12 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">You have not posted any requests yet.</p>
          <Link
            href="/jobs/new"
            className="mt-4 inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Create your first request
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {jobs.map((job) => (
            <li key={job._id}>
              <JobCard job={job} />
            </li>
          ))}
        </ul>
      )}

      {pagination && pagination.totalPages > 1 ? (
        <nav className="flex items-center justify-center gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          {page > 1 ? (
            <Link
              href={page === 2 ? "/jobs/mine" : `/jobs/mine?page=${page - 1}`}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-900"
            >
              Previous
            </Link>
          ) : (
            <span className="rounded-lg border border-zinc-200 px-4 py-2 text-sm text-zinc-400 dark:border-zinc-800">
              Previous
            </span>
          )}
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            Page {page} of {pagination.totalPages}
          </span>
          {page < pagination.totalPages ? (
            <Link
              href={`/jobs/mine?page=${page + 1}`}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-900"
            >
              Next
            </Link>
          ) : (
            <span className="rounded-lg border border-zinc-200 px-4 py-2 text-sm text-zinc-400 dark:border-zinc-800">
              Next
            </span>
          )}
        </nav>
      ) : null}
    </div>
  );
}
