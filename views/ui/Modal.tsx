"use client";

import { cn } from "@/app/model/utils";
import { X } from "lucide-react";
import { useEffect, useCallback, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
};

/**
 * DESIGN.md §4.7 — Modals
 * Overlay: fixed inset 0, bg rgba(0,0,0,0.35), z-index 100, backdrop blur(3px), padding 24px 16px
 * Card: bg #ffffff, radius 10px, maxWidth per context, shadow 0 18px 45px rgba(0,0,0,0.15)
 * Header: bg #fdfdf8, padding 14px 20px, borderBottom 1px solid #e5e7e0, title 15px weight 700 Open Runde
 * Body: padding 16px 20px
 * Close button: bg none, border none, color #65675e, padding 4px, radius 4px
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
  className,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
        }}
        onClick={onClose}
      />

      {/* Card */}
      <div
        className={cn("relative w-full max-w-lg", className)}
        style={{
          zIndex: 1,
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0 18px 45px rgba(0,0,0,0.15)",
          maxHeight: "calc(100vh - 80px)",
          overflow: "auto",
        }}
      >
        {/* Header */}
        {title && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#fdfdf8",
              padding: "14px 20px",
              borderBottom: "1px solid #e5e7e0",
              borderRadius: "10px 10px 0 0",
            }}
          >
            <h2
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#23251d",
                fontFamily: "'Open Runde', sans-serif",
                margin: 0,
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                color: "#65675e",
                padding: "4px",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f5f5f0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
              aria-label="Tutup"
            >
              <X style={{ width: "18px", height: "18px" }} strokeWidth={2} />
            </button>
          </div>
        )}

        {/* Body */}
        <div style={{ padding: "16px 20px" }}>{children}</div>
      </div>
    </div>
  );
}
