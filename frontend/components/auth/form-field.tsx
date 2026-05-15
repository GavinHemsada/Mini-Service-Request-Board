import { inputClassName, labelClassName } from "./form-styles";

type Props = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
};

export function FormField({ id, label, hint, error, optional, children }: Props) {
  return (
    <div>
      <label htmlFor={id} className={labelClassName}>
        {label}
        {optional ? (
          <span className="ml-1 font-normal text-zinc-500 dark:text-zinc-400">(optional)</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }
) {
  const { hasError, className, ...rest } = props;
  return (
    <input
      className={`${inputClassName} ${hasError ? "border-red-400 focus:border-red-500 focus:ring-red-500/25" : ""} ${className ?? ""}`}
      aria-invalid={hasError || undefined}
      {...rest}
    />
  );
}

export function TextareaInput(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { hasError?: boolean }
) {
  const { hasError, className, ...rest } = props;
  return (
    <textarea
      className={`${inputClassName} resize-y min-h-[7rem] ${hasError ? "border-red-400 focus:border-red-500 focus:ring-red-500/25" : ""} ${className ?? ""}`}
      aria-invalid={hasError || undefined}
      {...rest}
    />
  );
}

export function SelectInput(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean }
) {
  const { hasError, className, children, ...rest } = props;
  return (
    <select
      className={`${inputClassName} ${hasError ? "border-red-400 focus:border-red-500 focus:ring-red-500/25" : ""} ${className ?? ""}`}
      aria-invalid={hasError || undefined}
      {...rest}
    >
      {children}
    </select>
  );
}
