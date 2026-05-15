import Link from "next/link";

type Props = {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
};

export function AuthPageShell({ title, description, children, footer }: Props) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:py-14">
      <div className="w-full max-w-[420px]">
        <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="border-b border-zinc-100 bg-gradient-to-br from-emerald-50 to-white px-6 py-6 dark:border-zinc-800 dark:from-emerald-950/40 dark:to-zinc-950">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              GlobalTNA
            </p>
            <h1 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {title}
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {description}
            </p>
          </div>
          <div className="px-6 py-6 sm:px-8 sm:py-7">{children}</div>
          <div className="border-t border-zinc-100 bg-zinc-50/80 px-6 py-4 text-center text-sm dark:border-zinc-800 dark:bg-zinc-900/50">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
}
