"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { ProfileMenu } from "@/components/profile-menu";

export function SiteNav() {
  const { user, ready } = useAuth();

  if (!ready) {
    return (
      <nav className="flex items-center gap-3 text-sm text-zinc-400" aria-hidden>
        …
      </nav>
    );
  }

  if (user) {
    return (
      <nav className="relative flex items-center justify-end">
        <ProfileMenu />
      </nav>
    );
  }

  return (
    <nav className="flex items-center gap-2 text-sm">
      <Link
        href="/login"
        className="rounded-lg px-3 py-1.5 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
      >
        Log in
      </Link>
      <Link
        href="/register"
        className="rounded-lg bg-zinc-900 px-3 py-1.5 font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        Register
      </Link>
    </nav>
  );
}
