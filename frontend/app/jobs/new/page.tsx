import type { Metadata } from "next";
import Link from "next/link";
import { NewJobForm } from "./new-job-form";

export const metadata: Metadata = {
  title: "New request",
  description: "Post a new homeowner service request.",
};

export default function NewJobPage() {
  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
      <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <header className="border-b border-zinc-100 bg-gradient-to-br from-emerald-50/90 via-white to-zinc-50 px-6 py-8 dark:border-zinc-800 dark:from-emerald-950/50 dark:via-zinc-950 dark:to-zinc-900/80 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            New listing
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
            Post a service request
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            Describe what you need and how providers can reach you. You must be signed in your
            account is linked to this request automatically.
          </p>
        </header>

        <div className="px-6 py-8 sm:px-8">
          <NewJobForm />
        </div>
      </div>
    </div>
  );
}
