"use client";

import { Suspense } from "react";
import { ActiveFilters } from "@/components/active-filters";
import { CategoryFilter } from "@/components/category-filter";
import { JobSearch } from "@/components/job-search";
import { StatusFilter } from "@/components/status-filter";

type Props = {
  category: string;
  status: string;
};

export function HomeToolbar({ category, status }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:items-end">
        <CategoryFilter category={category} />
        <StatusFilter status={status} />
        <div className="sm:col-span-2 lg:col-span-1">
          <JobSearch />
        </div>
      </div>
      <Suspense fallback={null}>
        <ActiveFilters />
      </Suspense>
    </div>
  );
}
