import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JobStatusBadge } from "@/components/job-status-badge";
import { JobActions } from "./job-actions";
import { MyJobsList } from "./my-jobs-list";
import { fetchJob } from "@/lib/server-api";
import { isJobId, isMyJobsRoute } from "@/lib/job-route";
import type { Job } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function posterLabel(job: Job): string | null {
  const cb = job.createdBy;
  if (!cb || typeof cb === "string") return null;
  if (cb.name?.trim()) return cb.name.trim();
  if (cb.email) return cb.email;
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  if (isMyJobsRoute(id)) {
    return { title: "My requests", description: "Your posted service requests." };
  }
  if (!isJobId(id)) return { title: "Job not found" };
  const job = await fetchJob(id).catch(() => null);
  if (!job) return { title: "Job not found" };
  return { title: job.title, description: job.description.slice(0, 160) };
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-zinc-100 py-3 last:border-0 dark:border-zinc-800">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-100">{children}</dd>
    </div>
  );
}

function JobDetailView({ job }: { job: Job }) {
  const postedBy = posterLabel(job);

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <header className="border-b border-zinc-100 bg-gradient-to-br from-emerald-50/90 via-white to-zinc-50 px-6 py-8 dark:border-zinc-800 dark:from-emerald-950/50 dark:via-zinc-950 dark:to-zinc-900/80 sm:px-8">
          <div className="flex flex-wrap items-center gap-2">
            <JobStatusBadge status={job.status} />
            {job.category ? (
              <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-600 ring-1 ring-zinc-200 dark:bg-zinc-900/80 dark:text-zinc-300 dark:ring-zinc-700">
                {job.category}
              </span>
            ) : null}
          </div>
          <h1 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            {job.title}
          </h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
            <time dateTime={job.createdAt}>Posted {formatDate(job.createdAt)}</time>
            {job.location ? (
              <>
                <span className="hidden text-zinc-300 sm:inline dark:text-zinc-600" aria-hidden>
                  ·
                </span>
                <span>{job.location}</span>
              </>
            ) : null}
          </p>
          {postedBy ? (
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
              Listed by <span className="font-medium text-zinc-700 dark:text-zinc-300">{postedBy}</span>
            </p>
          ) : null}
        </header>

        <div className="grid gap-0 lg:grid-cols-5">
          <section className="border-b border-zinc-100 px-6 py-8 dark:border-zinc-800 lg:col-span-3 lg:border-b-0 lg:border-r">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Description
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
              {job.description}
            </p>
          </section>

          <aside className="bg-zinc-50/80 px-6 py-8 dark:bg-zinc-900/40 lg:col-span-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Contact & location
            </h2>
            <dl className="mt-4">
              <DetailRow label="Location">{job.location?.trim() ? job.location : "—"}</DetailRow>
              <DetailRow label="Contact name">
                {job.contactName?.trim() ? job.contactName : "—"}
              </DetailRow>
              <DetailRow label="Email">
                <a
                  href={`mailto:${job.contactEmail}`}
                  className="break-all font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
                >
                  {job.contactEmail}
                </a>
              </DetailRow>
            </dl>
          </aside>
        </div>
      </article>

      <div className="mt-6">
        <JobActions job={job} key={`${job._id}-${job.status}-${job.updatedAt}`} />
      </div>
    </div>
  );
}

export default async function JobPage({ params }: Props) {
  const { id } = await params;

  if (isMyJobsRoute(id)) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
        <div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            My requests
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Every job you have posted is linked to your account. You can create as many as you need.
          </p>
        </div>
        <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
          <MyJobsList />
        </Suspense>
      </div>
    );
  }

  if (!isJobId(id)) notFound();

  let job;
  try {
    job = await fetchJob(id);
  } catch {
    throw new Error("Failed to load job");
  }
  if (!job) notFound();

  return <JobDetailView job={job} />;
}
