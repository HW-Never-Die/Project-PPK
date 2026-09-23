"use client";

import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-6">
      <div className="bg-white border border-[#d1d5db] rounded-lg shadow-sm p-6 min-h-[500px]">
        {children}
      </div>
    </div>
  );
}
