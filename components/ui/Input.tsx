"use client";

import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({
  label,
  error,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-caption font-medium text-deep-moss font-ibm-plex-sans-variable"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-md border border-warm-mist bg-paper-white px-3 py-2 text-caption text-deep-moss font-ibm-plex-sans-variable",
          "placeholder:text-ash-green",
          "focus:outline-none focus:border-signal-blue focus:ring-1 focus:ring-signal-blue",
          "transition-colors duration-150",
          error && "border-flame-orange",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-micro text-flame-orange">{error}</p>
      )}
    </div>
  );
}
