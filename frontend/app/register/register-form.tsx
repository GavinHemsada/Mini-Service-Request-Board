"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { FormAlert } from "@/components/auth/form-alert";
import { FormField, TextInput } from "@/components/auth/form-field";
import { PasswordInput } from "@/components/auth/password-input";
import { SubmitButton } from "@/components/auth/submit-button";
import { useAuth } from "@/components/auth-provider";
import { ApiError } from "@/lib/client-api";

function passwordStrength(password: string): { label: string; width: string; color: string } {
  if (password.length === 0) {
    return { label: "", width: "0%", color: "bg-zinc-200" };
  }
  if (password.length < 8) {
    return { label: "Too short — use at least 8 characters", width: "33%", color: "bg-red-500" };
  }
  if (password.length < 12) {
    return { label: "Good — 8+ characters", width: "66%", color: "bg-amber-500" };
  }
  return { label: "Strong password", width: "100%", color: "bg-emerald-500" };
}

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => passwordStrength(password), [password]);

  function validate() {
    const errs: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};
    const trimmedName = name.trim();
    if (!trimmedName) errs.name = "Name is required.";
    else if (trimmedName.length < 2) errs.name = "Enter at least 2 characters.";
    const trimmedEmail = email.trim();
    if (!trimmedEmail) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errs.email = "Enter a valid email address.";
    }
    if (!password) errs.password = "Password is required.";
    else if (password.length < 8) errs.password = "Use at least 8 characters.";
    if (!confirmPassword) errs.confirmPassword = "Please confirm your password.";
    else if (password !== confirmPassword) errs.confirmPassword = "Passwords do not match.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    const trimmedName = name.trim();
    setLoading(true);
    try {
      await register(email.trim(), password, trimmedName);
      router.replace(next?.startsWith("/") ? next : "/");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("We could not create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const loginHref = next ? `/login?next=${encodeURIComponent(next)}` : "/login";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {error ? <FormAlert title="Registration failed">{error}</FormAlert> : null}

      <FormField id="name" label="Full name" error={fieldErrors.name} hint="Shown on requests you post.">
        <TextInput
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Alex Smith"
          autoFocus
          disabled={loading}
          hasError={!!fieldErrors.name}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (fieldErrors.name) setFieldErrors((f) => ({ ...f, name: undefined }));
          }}
        />
      </FormField>

      <FormField id="email" label="Email address" error={fieldErrors.email}>
        <TextInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          disabled={loading}
          hasError={!!fieldErrors.email}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors((f) => ({ ...f, email: undefined }));
          }}
        />
      </FormField>

      <FormField id="password" label="Password" error={fieldErrors.password}>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          disabled={loading}
          hasError={!!fieldErrors.password}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password) setFieldErrors((f) => ({ ...f, password: undefined }));
            if (fieldErrors.confirmPassword && confirmPassword) {
              setFieldErrors((f) => ({ ...f, confirmPassword: undefined }));
            }
          }}
        />
        {password.length > 0 ? (
          <div className="mt-2.5 space-y-1.5">
            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
              <div
                className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                style={{ width: strength.width }}
              />
            </div>
            {strength.label ? (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{strength.label}</p>
            ) : null}
          </div>
        ) : (
          <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">Minimum 8 characters.</p>
        )}
      </FormField>

      <FormField
        id="confirmPassword"
        label="Confirm password"
        error={fieldErrors.confirmPassword}
        hint="Re-enter the same password to confirm."
      >
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Repeat your password"
          disabled={loading}
          hasError={!!fieldErrors.confirmPassword}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (fieldErrors.confirmPassword) {
              setFieldErrors((f) => ({ ...f, confirmPassword: undefined }));
            }
          }}
        />
      </FormField>

      <SubmitButton loading={loading} loadingLabel="Creating account…">
        Create account
      </SubmitButton>

      <p className="text-center text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        By creating an account you can post service requests and update job status when browsing.
      </p>
    </form>
  );
}
