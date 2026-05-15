"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function JobSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q") ?? "";

  function applySearch(query: string) {
    const trimmed = query.trim();
    const next = new URLSearchParams(searchParams.toString());
    if (trimmed) next.set("q", trimmed);
    else next.delete("q");
    next.delete("page");
    const s = next.toString();
    router.push(s ? `/?${s}` : "/");
  }

  function clearSearch() {
    applySearch("");
  }

  return (
    <form
      key={qParam}
      className="flex flex-1 flex-col gap-1 text-sm sm:max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        const raw = String(new FormData(e.currentTarget).get("q") ?? "");
        applySearch(raw);
      }}
    >
      <label htmlFor="job-search" className="font-medium text-zinc-600 dark:text-zinc-400">
        Search
      </label>
      <div className="flex gap-2">
        <input
          id="job-search"
          name="q"
          type="search"
          defaultValue={qParam}
          onChange={(e) => {
            if (e.target.value.trim() === "" && qParam) clearSearch();
          }}
          placeholder="Keywords in title or description"
          className="min-w-0 flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
        />
        {qParam ? (
          <button
            type="button"
            onClick={clearSearch}
            className="shrink-0 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Clear
          </button>
        ) : null}
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Search
        </button>
      </div>
    </form>
  );
}
