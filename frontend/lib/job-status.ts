import type { JobStatus } from "@/lib/types";

export function jobStatusClass(status: JobStatus): string {
  if (status === "Open") {
    return "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/20 dark:bg-emerald-950 dark:text-emerald-200 dark:ring-emerald-500/30";
  }
  if (status === "In Progress") {
    return "bg-amber-100 text-amber-900 ring-1 ring-amber-600/20 dark:bg-amber-950 dark:text-amber-100 dark:ring-amber-500/30";
  }
  return "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-400/20 dark:bg-zinc-800 dark:text-zinc-200 dark:ring-zinc-600/30";
}
