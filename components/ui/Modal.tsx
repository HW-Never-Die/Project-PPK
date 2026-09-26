"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useEffect, useCallback, type ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
};

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-pure-black/25"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-lg rounded-[6px] border border-warm-mist bg-paper-white",
          className
        )}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-warm-mist px-4 py-3">
            <h2 className="text-subheading font-semibold tracking-subheading text-deep-moss">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-[#111827] bg-black/5 hover:bg-black/10 hover:text-black transition-colors duration-150 cursor-pointer flex items-center justify-center"
              aria-label="Tutup"
            >
              <X className="h-7 w-7" strokeWidth={2.5} />
            </button>
          </div>
        )}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
