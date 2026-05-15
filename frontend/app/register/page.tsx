import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Create account",
};

export default function RegisterPage() {
  return (
    <AuthPageShell
      title="Create your account"
      description="Join in seconds. Post homeowner requests and track them from your profile."
      footer={
        <>
          <span className="text-zinc-600 dark:text-zinc-400">Already registered? </span>
          <Link
            href="/login"
            className="font-medium text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-400"
          >
            Sign in
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
        <RegisterForm />
      </Suspense>
    </AuthPageShell>
  );
}
