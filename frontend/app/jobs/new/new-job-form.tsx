"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormAlert } from "@/components/auth/form-alert";
import { FormField, SelectInput, TextareaInput, TextInput } from "@/components/auth/form-field";
import { SubmitButton } from "@/components/auth/submit-button";
import { useAuth } from "@/components/auth-provider";
import { ApiError, createJobRequest } from "@/lib/client-api";
import { JOB_CATEGORIES } from "@/lib/types";

type FormState = {
  title: string;
  description: string;
  category: string;
  location: string;
  contactName: string;
  contactEmail: string;
};

const emptyForm = (defaults?: { contactName?: string; contactEmail?: string }): FormState => ({
  title: "",
  description: "",
  category: JOB_CATEGORIES[0],
  location: "",
  contactName: defaults?.contactName ?? "",
  contactEmail: defaults?.contactEmail ?? "",
});

function SectionHeading({ title, description }: { title: string; description?: string }) {
  return (
    <div className="border-b border-zinc-100 pb-4 dark:border-zinc-800">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {title}
      </h2>
      {description ? (
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
      ) : null}
    </div>
  );
}

export function NewJobForm() {
  const router = useRouter();
  const { token, user, ready } = useAuth();
  const [form, setForm] = useState<FormState>(() => emptyForm());
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (!ready) return;
    if (!token) {
      router.replace(`/login?next=${encodeURIComponent("/jobs/new")}`);
    }
  }, [ready, token, router]);

  useEffect(() => {
    if (!user || prefilled) return;
    setForm((f) => ({
      ...f,
      contactName: f.contactName || user.name?.trim() || "",
      contactEmail: f.contactEmail || user.email?.trim() || "",
    }));
    setPrefilled(true);
  }, [user, prefilled]);

  if (!ready || !token) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12" aria-live="polite">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-600/30 border-t-emerald-600" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Checking your session…</p>
      </div>
    );
  }

  function clearError(field: string) {
    if (fieldErrors[field]) {
      setFieldErrors((e) => {
        const next = { ...e };
        delete next[field];
        return next;
      });
    }
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    const email = form.contactEmail.trim() || user?.email?.trim() || "";
    if (!email) {
      e.contactEmail = "Contact email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.contactEmail = "Enter a valid email address.";
    }
    setFieldErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setSubmitError(null);
    if (!validate()) return;
    if (!token) return;
    setSubmitting(true);
    try {
      const job = await createJobRequest(token, {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        location: form.location.trim(),
        contactName: form.contactName.trim(),
        contactEmail: form.contactEmail.trim() || (user?.email?.trim() ?? ""),
      });
      router.push(`/jobs/${job._id}`);
    } catch (err) {
      if (err instanceof ApiError) setSubmitError(err.message);
      else setSubmitError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const accountEmail = user?.email ?? "your account email";

  return (
    <form onSubmit={onSubmit} className="space-y-8" noValidate>
      {submitError ? <FormAlert title="Could not post request">{submitError}</FormAlert> : null}

      <section className="space-y-5">
        <SectionHeading
          title="Request details"
          description="Give providers a clear picture of the job."
        />

        <FormField id="title" label="Title" error={fieldErrors.title}>
          <TextInput
            id="title"
            name="title"
            placeholder="e.g. Leaking kitchen tap"
            autoFocus
            disabled={submitting}
            hasError={!!fieldErrors.title}
            value={form.title}
            onChange={(e) => {
              setForm((f) => ({ ...f, title: e.target.value }));
              clearError("title");
            }}
          />
        </FormField>

        <FormField
          id="description"
          label="Description"
          error={fieldErrors.description}
          hint="Include access, timing, and anything tradespeople should know."
        >
          <TextareaInput
            id="description"
            name="description"
            rows={5}
            placeholder="What needs doing, urgency, parking, pets, etc."
            disabled={submitting}
            hasError={!!fieldErrors.description}
            value={form.description}
            onChange={(e) => {
              setForm((f) => ({ ...f, description: e.target.value }));
              clearError("description");
            }}
          />
        </FormField>

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="category" label="Category">
            <SelectInput
              id="category"
              name="category"
              disabled={submitting}
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            >
              {JOB_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </SelectInput>
          </FormField>

          <FormField id="location" label="Location" optional hint="City or area helps local providers find you.">
            <TextInput
              id="location"
              name="location"
              placeholder="e.g. Glasgow"
              disabled={submitting}
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
            />
          </FormField>
        </div>
      </section>

      <section className="space-y-5 rounded-xl border border-zinc-100 bg-zinc-50/80 p-5 dark:border-zinc-800 dark:bg-zinc-900/40 sm:p-6">
        <SectionHeading
          title="Contact & location"
          description="How should providers reach you about this request?"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField id="contactName" label="Contact name" optional>
            <TextInput
              id="contactName"
              name="contactName"
              autoComplete="name"
              placeholder={user?.name || "Your name"}
              disabled={submitting}
              value={form.contactName}
              onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))}
            />
          </FormField>

          <FormField
            id="contactEmail"
            label="Contact email"
            optional
            error={fieldErrors.contactEmail}
            hint={
              fieldErrors.contactEmail
                ? undefined
                : `Leave blank to use ${accountEmail}.`
            }
          >
            <TextInput
              id="contactEmail"
              name="contactEmail"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder={user?.email || "you@example.com"}
              disabled={submitting}
              hasError={!!fieldErrors.contactEmail}
              value={form.contactEmail}
              onChange={(e) => {
                setForm((f) => ({ ...f, contactEmail: e.target.value }));
                clearError("contactEmail");
              }}
            />
          </FormField>
        </div>
      </section>

      <div className="flex flex-col gap-3 border-t border-zinc-100 pt-6 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          New requests start as <span className="font-medium text-zinc-700 dark:text-zinc-300">Open</span>.
          Anyone signed in can update status later.
        </p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-zinc-300 px-5 py-2.5 text-center text-sm font-medium text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Cancel
          </Link>
          <div className="sm:w-44">
            <SubmitButton loading={submitting} loadingLabel="Posting…">
              Post request
            </SubmitButton>
          </div>
        </div>
      </div>
    </form>
  );
}
