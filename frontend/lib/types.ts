export type JobStatus = "Open" | "In Progress" | "Closed";

export const JOB_STATUSES: JobStatus[] = ["Open", "In Progress", "Closed"];

export type JobOwner = {
  _id: string;
  email: string;
  name?: string;
};

export type Job = {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  contactName: string;
  contactEmail: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | JobOwner | null;
};

export type JobsPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedJobs = {
  data: Job[];
  pagination: JobsPagination;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export const JOB_CATEGORIES = [
  "Plumbing",
  "Electrical",
  "Painting",
  "Joinery",
] as const;

export function jobOwnerId(job: Job): string | null {
  if (!job.createdBy) return null;
  if (typeof job.createdBy === "string") return job.createdBy;
  return job.createdBy._id ?? null;
}
