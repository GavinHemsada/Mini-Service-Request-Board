"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { ApiError, deleteJobRequest, updateJobStatusRequest } from "@/lib/client-api";
import type { Job, JobStatus } from "@/lib/types";
import { jobOwnerId } from "@/lib/types";

const STATUSES: JobStatus[] = ["Open", "In Progress", "Closed"];

const selectClassName =
  "min-w-[11rem] max-w-xs rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100";

export function JobActions({ job }: { job: Job }) {
  const router = useRouter();
  const { token, user, ready } = useAuth();
  const [status, setStatus] = useState<JobStatus>(job.status);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const ownerId = jobOwnerId(job);
  const isOwner = !!user && !!ownerId && ownerId === user.id;
  const isAuthenticated = ready && !!token && !!user;
  const loginHref = `/login?next=${encodeURIComponent(`/jobs/${job._id}`)}`;

  async function onStatusChange(next: JobStatus) {
    if (!isAuthenticated || !token || next === status) return;
    setBusy(true);
    setMessage(null);
    try {
      await updateJobStatusRequest(token, job._id, next);
      setStatus(next);
      router.refresh();
    } catch (e) {
      if (e instanceof ApiError) {
        setMessage(e.message);
        if (e.status === 401) setStatus(job.status);
      } else {
        setMessage("Could not update status.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!isAuthenticated || !token || !isOwner) return;
    if (!window.confirm("Delete this request permanently?")) return;
    setBusy(true);
    setMessage(null);
    try {
      await deleteJobRequest(token, job._id);
      router.push("/jobs/mine");
      router.refresh();
    } catch (e) {
      if (e instanceof ApiError) setMessage(e.message);
      else setMessage("Could not delete.");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
        Checking your session…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-6 dark:border-zinc-800 dark:bg-zinc-900/60">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Actions</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          <Link href={loginHref} className="font-medium text-emerald-700 underline dark:text-emerald-400">
            Sign in
          </Link>{" "}
          to update the status. Only the person who posted this request can delete it.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="border-b border-zinc-100 bg-zinc-50/80 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {isOwner ? "Manage this request" : "Update status"}
        </h2>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {isOwner
            ? "You posted this request. You can change status or delete it."
            : "Any signed-in user can update status. Only the creator can delete."}
        </p>
      </div>
      <div className="px-6 py-5">
        {message ? (
          <p
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100"
            role="alert"
          >
            {message}
          </p>
        ) : null}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex flex-1 flex-wrap items-center gap-3 text-sm">
            <span className="shrink-0 font-medium text-zinc-700 dark:text-zinc-300">Status</span>
            <select
              value={status}
              disabled={busy}
              onChange={(e) => onStatusChange(e.target.value as JobStatus)}
              className={selectClassName}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          {isOwner ? (
            <button
              type="button"
              disabled={busy}
              onClick={onDelete}
              className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-800 transition hover:bg-red-100 disabled:opacity-60 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100 dark:hover:bg-red-950"
            >
              Delete request
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
