"use client";

import { Check, X } from "lucide-react";
import { SlotAvailability } from "@/types";

interface SlotGridProps {
  slots: SlotAvailability[];
  interactive?: boolean;
  selectedSlots?: string[];
  onToggleSlot?: (slotId: string) => void;
  isLoading?: boolean;
}

export default function SlotGrid({
  slots,
  interactive = false,
  selectedSlots = [],
  onToggleSlot,
  isLoading = false,
}: SlotGridProps) {
  if (isLoading) {
    return (
      <div className="py-8 text-center text-sm text-[#65675e]">
        <div className="inline-block w-6 h-6 border-2 border-[#eb9d2a] border-t-transparent rounded-full animate-spin mb-2" />
        <p>Memuat ketersediaan slot...</p>
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-[#65675e] bg-[#fdfdf8] border border-[#bfc1b7] rounded-[4px]">
        Tidak ada data slot untuk tanggal yang dipilih.
      </div>
    );
  }

  const availableCount = slots.filter((s) => s.available).length;
  const occupiedCount = slots.length - availableCount;

  return (
    <div className="space-y-4">
      {/* Legend & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-[#eeefe9] pb-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-[2px] bg-[#e8f5e9] border border-[#a5d6a7]" />
            <span className="text-[#2e7d32] font-semibold">Tersedia ({availableCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-[2px] bg-[#f3f4f6] border border-[#d1d5db]" />
            <span className="text-[#6b7280] font-semibold">Terisi / Libur ({occupiedCount})</span>
          </div>
          {interactive && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-[2px] bg-[#eb9d2a] border border-[#d88c22]" />
              <span className="text-[#23251d] font-bold">Dipilih ({selectedSlots.length})</span>
            </div>
          )}
        </div>
        <span className="text-[#65675e] font-mono text-[11px]">Total 26 Slot (07:00 - 20:00)</span>
      </div>

      {/* Grid of Slots */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {slots.map((slot) => {
          const isSelected = selectedSlots.includes(slot.id);
          const isAvailable = slot.available;

          let cardStyle = "bg-[#f3f4f6] border-[#d1d5db] text-[#9ca3af] cursor-not-allowed";
          if (isSelected) {
            cardStyle = "bg-[#eb9d2a] border-[#d88c22] text-[#23251d] font-bold shadow-xs cursor-pointer";
          } else if (isAvailable) {
            cardStyle = interactive
              ? "bg-[#e8f5e9] border-[#a5d6a7] text-[#2e7d32] hover:border-[#2e7d32] cursor-pointer"
              : "bg-[#e8f5e9] border-[#a5d6a7] text-[#2e7d32] cursor-default";
          }

          return (
            <button
              key={slot.id}
              type="button"
              disabled={!isAvailable && !isSelected}
              onClick={() => {
                if (interactive && isAvailable) {
                  onToggleSlot?.(slot.id);
                }
              }}
              className={`p-2 border rounded-[4px] text-center text-xs transition-all flex flex-col items-center justify-center gap-0.5 ${cardStyle}`}
            >
              <div className="font-mono font-medium text-[11px] leading-tight">
                {slot.time}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-semibold">
                {isSelected ? (
                  <span>Dipilih</span>
                ) : isAvailable ? (
                  <span className="flex items-center gap-0.5">
                    <Check className="w-3 h-3" />
                    Tersedia
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5">
                    <X className="w-3 h-3" />
                    Terisi
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
