import Link from "next/link";
import type { JobsPagination } from "@/lib/types";
import { buildHomeQuery } from "@/lib/search-params";

type Props = {
  pagination: JobsPagination;
  category?: string;
  status?: string;
  q?: string;
};

export function JobsPagination({ pagination, category, status, q }: Props) {
  const { page, limit, total, totalPages } = pagination;

  if (totalPages <= 1) return null;

  const filters = { category, status, q };
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const prevHref = page > 1 ? buildHomeQuery({ ...filters, page: page - 1 }) : null;
  const nextHref = page < totalPages ? buildHomeQuery({ ...filters, page: page + 1 }) : null;

  const pageNumbers: number[] = [];
  const windowSize = 5;
  let start = Math.max(1, page - Math.floor(windowSize / 2));
  let end = Math.min(totalPages, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  for (let p = start; p <= end; p += 1) pageNumbers.push(p);

  return (
    <nav
      className="flex flex-col items-center gap-4 border-t border-zinc-200 pt-8 dark:border-zinc-800"
      aria-label="Pagination"
    >
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Showing <span className="font-medium text-zinc-900 dark:text-zinc-100">{from}</span>–
        <span className="font-medium text-zinc-900 dark:text-zinc-100">{to}</span> of{" "}
        <span className="font-medium text-zinc-900 dark:text-zinc-100">{total}</span> requests
        <span className="text-zinc-400"> · </span>
        Page {page} of {totalPages}
      </p>
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          {prevHref ? (
            <Link
              href={prevHref}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              Previous
            </Link>
          ) : (
            <span className="rounded-lg border border-zinc-200 px-4 py-2 text-sm text-zinc-400 dark:border-zinc-800">
              Previous
            </span>
          )}
        </li>
        {pageNumbers.map((p) => (
          <li key={p}>
            <Link
              href={buildHomeQuery({ ...filters, page: p })}
              aria-current={p === page ? "page" : undefined}
              className={`min-w-[2.5rem] rounded-lg px-3 py-2 text-center text-sm font-medium ${
                p === page
                  ? "bg-emerald-600 text-white"
                  : "border border-zinc-300 text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-900"
              }`}
            >
              {p}
            </Link>
          </li>
        ))}
        <li>
          {nextHref ? (
            <Link
              href={nextHref}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              Next
            </Link>
          ) : (
            <span className="rounded-lg border border-zinc-200 px-4 py-2 text-sm text-zinc-400 dark:border-zinc-800">
              Next
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
