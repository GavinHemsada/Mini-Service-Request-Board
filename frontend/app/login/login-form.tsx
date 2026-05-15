"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FormAlert } from "@/components/auth/form-alert";
import { FormField, TextInput } from "@/components/auth/form-field";
import { PasswordInput } from "@/components/auth/password-input";
import { SubmitButton } from "@/components/auth/submit-button";
import { useAuth } from "@/components/auth-provider";
import { ApiError } from "@/lib/client-api";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate() {
    const errs: { email?: string; password?: string } = {};
    const trimmedEmail = email.trim();
    if (!trimmedEmail) errs.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errs.email = "Enter a valid email address.";
    }
    if (!password) errs.password = "Password is required.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.replace(next.startsWith("/") ? next : "/");
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError("We could not sign you in. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  const registerHref =
    next && next !== "/"
      ? `/register?next=${encodeURIComponent(next)}`
      : "/register";

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {error ? <FormAlert title="Sign in failed">{error}</FormAlert> : null}

      <FormField id="email" label="Email address" error={fieldErrors.email}>
        <TextInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="you@example.com"
          autoFocus
          disabled={loading}
          hasError={!!fieldErrors.email}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) setFieldErrors((f) => ({ ...f, email: undefined }));
          }}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
        />
      </FormField>

      <FormField
        id="password"
        label="Password"
        error={fieldErrors.password}
        hint="Use the password you chose when you registered."
      >
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          disabled={loading}
          hasError={!!fieldErrors.password}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (fieldErrors.password) setFieldErrors((f) => ({ ...f, password: undefined }));
          }}
        />
      </FormField>

      <SubmitButton loading={loading} loadingLabel="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}
