type Variant = "error" | "success";

const styles: Record<Variant, string> = {
  error:
    "border-red-200 bg-red-50 text-red-900 dark:border-red-900/60 dark:bg-red-950/50 dark:text-red-100",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/50 dark:text-emerald-100",
};

export function FormAlert({
  variant = "error",
  title,
  children,
}: {
  variant?: Variant;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="alert"
      className={`rounded-lg border px-3.5 py-3 text-sm ${styles[variant]}`}
    >
      {title ? <p className="font-medium">{title}</p> : null}
      <p className={title ? "mt-0.5 text-[13px] opacity-90" : ""}>{children}</p>
    </div>
  );
}
