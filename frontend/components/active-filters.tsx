"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { buildHomeQuery } from "@/lib/search-params";

export function ActiveFilters() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "";
  const status = searchParams.get("status") ?? "";
  const q = searchParams.get("q") ?? "";

  if (!category && !status && !q) return null;

  const chips: { label: string; clearHref: string }[] = [];

  if (category) {
    chips.push({
      label: `Category: ${category}`,
      clearHref: buildHomeQuery({ status: status || undefined, q: q || undefined }),
    });
  }
  if (status) {
    chips.push({
      label: `Status: ${status}`,
      clearHref: buildHomeQuery({ category: category || undefined, q: q || undefined }),
    });
  }
  if (q) {
    chips.push({
      label: `Search: “${q}”`,
      clearHref: buildHomeQuery({
        category: category || undefined,
        status: status || undefined,
      }),
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-zinc-500 dark:text-zinc-400">Filters:</span>
      {chips.map((chip) => (
        <Link
          key={chip.label}
          href={chip.clearHref}
          className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          {chip.label}
          <span aria-hidden className="text-zinc-400">
            ×
          </span>
        </Link>
      ))}
      <Link
        href="/"
        className="text-xs font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
      >
        Clear all
      </Link>
    </div>
  );
}
