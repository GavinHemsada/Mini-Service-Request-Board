"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { JOB_CATEGORIES } from "@/lib/types";

type Props = {
  category: string;
};

export function CategoryFilter({ category }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-zinc-600 dark:text-zinc-400">Category</span>
      <select
        className="max-w-xs rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
        value={category}
        onChange={(e) => {
          const next = new URLSearchParams(searchParams.toString());
          const v = e.target.value;
          if (v) next.set("category", v);
          else next.delete("category");
          next.delete("page");
          const q = next.toString();
          router.push(q ? `/?${q}` : "/");
        }}
      >
        <option value="">All categories</option>
        {JOB_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </label>
  );
}
