"use client";

import type { ReactNode } from "react";

/**
 * DESIGN.md §3.1 — Global Layout
 * Main Container: max-w-6xl mx-auto p-6
 * Card: bg #ffffff, border #d1d5db (Medium border), radius 8px, shadow
 * Background sky/skyscraper now global in app/layout.tsx
 */
export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-6">
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          padding: "24px",
          minHeight: "500px",
        }}
      >
        {children}
      </div>
    </div>
  );
}
