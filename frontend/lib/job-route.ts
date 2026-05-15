export const MY_JOBS_SEGMENT = "mine";

export function isMyJobsRoute(id: string): boolean {
  return id === MY_JOBS_SEGMENT;
}

export function isJobId(id: string): boolean {
  return /^[a-fA-F0-9]{24}$/.test(id);
}
