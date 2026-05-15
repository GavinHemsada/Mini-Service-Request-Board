import type { JobStatus } from "@/lib/types";
import { jobStatusClass } from "@/lib/job-status";

export function JobStatusBadge({ status, className = "" }: { status: JobStatus; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${jobStatusClass(status)} ${className}`}
    >
      {status}
    </span>
  );
}
