"use client";

import { type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

/**
 * DESIGN.md §4.6 — Form Inputs
 * Padding: 9px 12px, border: 1px solid #bfc1b7, radius: 6px, font: 13px
 * Label: 13px, weight 600, color #23251d, marginBottom 6px
 * Transition: border-color 0.15s ease
 */
export default function Input({
  label,
  error,
  className,
  id,
  type,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#23251d",
            fontFamily: "'IBM Plex Sans Variable', sans-serif",
          }}
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          id={inputId}
          type={type}
          className={cn(
            "w-full font-ibm-plex-sans-variable",
            "focus:outline-none focus:border-signal-blue focus:ring-1 focus:ring-signal-blue",
            className
          )}
          style={{
            padding: "9px 12px",
            border: `1px solid ${error ? "#f54e00" : "#bfc1b7"}`,
            borderRadius: "6px",
            fontSize: "13px",
            color: "#23251d",
            backgroundColor: "#ffffff",
            transition: "border-color 0.15s ease",
            fontFamily: "'IBM Plex Sans Variable', sans-serif",
          }}
          {...props}
        />
      </div>
      {error && (
        <p
          style={{
            fontSize: "12px",
            color: "#f54e00",
            fontFamily: "'IBM Plex Sans Variable', sans-serif",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
