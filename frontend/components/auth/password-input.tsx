"use client";

import { useState } from "react";
import { TextInput } from "./form-field";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  hasError?: boolean;
};

export function PasswordInput({ hasError, id, ...rest }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative mt-1.5">
      <TextInput
        id={id}
        type={visible ? "text" : "password"}
        hasError={hasError}
        className="pr-11"
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-medium text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
