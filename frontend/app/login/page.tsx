import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <AuthPageShell
      title="Welcome back"
      description="Sign in to post service requests, update job status, and manage your listings."
      footer={
        <>
          <span className="text-zinc-600 dark:text-zinc-400">Don&apos;t have an account? </span>
          <Link
            href="/register"
            className="font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
          >
            Create one
          </Link>
        </>
      }
    >
      <Suspense
        fallback={
          <div className="flex justify-center py-8">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600/30 border-t-emerald-600" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthPageShell>
  );
}
