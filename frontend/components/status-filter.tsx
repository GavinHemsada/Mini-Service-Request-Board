"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { JOB_STATUSES } from "@/lib/types";

type Props = {
  status: string;
};

export function StatusFilter({ status }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function applyStatus(value: string) {
    const next = new URLSearchParams(searchParams.toString());
    if (value) next.set("status", value);
    else next.delete("status");
    next.delete("page");
    const s = next.toString();
    router.push(s ? `/?${s}` : "/");
  }

  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-zinc-600 dark:text-zinc-400">Status</span>
      <select
        className="max-w-xs rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
        value={status}
        onChange={(e) => applyStatus(e.target.value)}
      >
        <option value="">All statuses</option>
        {JOB_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </label>
  );
}
