import Link from "next/link";
import { JobStatusBadge } from "@/components/job-status-badge";
import type { Job } from "@/lib/types";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function JobCard({ job }: { job: Job }) {
  return (
    <Link
      href={`/jobs/${job._id}`}
      className="group block rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-emerald-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-emerald-800"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-base font-semibold text-zinc-900 group-hover:text-emerald-700 dark:text-zinc-50 dark:group-hover:text-emerald-400">
          {job.title}
        </h2>
        <JobStatusBadge status={job.status} className="shrink-0" />
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{job.description}</p>
      <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-500">
        {job.category ? (
          <div>
            <dt className="sr-only">Category</dt>
            <dd>{job.category}</dd>
          </div>
        ) : null}
        {job.location ? (
          <div>
            <dt className="sr-only">Location</dt>
            <dd>{job.location}</dd>
          </div>
        ) : null}
        <div>
          <dt className="sr-only">Posted</dt>
          <dd>{formatDate(job.createdAt)}</dd>
        </div>
      </dl>
    </Link>
  );
}
