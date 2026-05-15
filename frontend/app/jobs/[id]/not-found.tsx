import Link from "next/link";

export default function JobNotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center gap-4 px-4 py-20 text-center">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Request not found</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">It may have been removed or the link is incorrect.</p>
      <Link
        href="/"
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
      >
        Back to listings
      </Link>
    </div>
  );
}
