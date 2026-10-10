"use client";

import { cn } from "@/app/model/utils";
import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
};

/**
 * DESIGN.md §4.6 — Form Inputs (same pattern for select)
 * Padding: 9px 12px, border: 1px solid #bfc1b7, radius: 6px, font: 13px
 * Label: 13px, weight 600, color #23251d, marginBottom 6px
 */
export default function Select({
  label,
  error,
  options,
  placeholder,
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      {label && (
        <label
          htmlFor={selectId}
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
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            "w-full appearance-none font-ibm-plex-sans-variable",
            "focus:outline-none focus:border-signal-blue focus:ring-1 focus:ring-signal-blue",
            className
          )}
          style={{
            padding: "9px 12px",
            paddingRight: "32px",
            border: `1px solid ${error ? "#f54e00" : "#bfc1b7"}`,
            borderRadius: "6px",
            fontSize: "13px",
            color: "#23251d",
            backgroundColor: "#ffffff",
            transition: "border-color 0.15s ease",
            fontFamily: "'IBM Plex Sans Variable', sans-serif",
          }}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
          style={{ width: "14px", height: "14px", color: "#9ea096" }}
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
