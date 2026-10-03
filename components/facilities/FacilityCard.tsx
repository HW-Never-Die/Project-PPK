"use client";

import Image from "next/image";
import { formatFacilityType } from "@/lib/utils";
import { Facility } from "@/types";

interface FacilityCardProps {
  facility: Facility;
  onViewDetail?: (facility: Facility) => void;
}

export default function FacilityCard({
  facility,
  onViewDetail,
}: FacilityCardProps) {
  const defaultImages: Record<string, string> = {
    ruang_kelas: "/images/facilities/ruang-kelas.webp",
    laboratorium: "/images/facilities/lab-komputer.webp",
    aula: "/images/facilities/aula.webp",
    lapangan: "/images/facilities/lapangan-basket.webp",
    alat: "/images/facilities/no-image.webp",
  };

  const imageSrc =
    facility.imageUrl && facility.imageUrl.trim() !== ""
      ? facility.imageUrl
      : defaultImages[facility.type] || "/images/facilities/no-image.webp";

  const isMaintenance = facility.status === "maintenance";

  return (
    <div className="bg-white border border-[#e5e7e0] rounded-[8px] overflow-hidden flex flex-col justify-between hover:border-[#bfc1b7] transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_3px_10px_rgba(0,0,0,0.04)]">
      <div>
        <div className="relative w-full aspect-[16/9] bg-[#eeefe9] overflow-hidden">
          <Image
            src={imageSrc}
            alt={facility.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-transform duration-300 ${
              isMaintenance ? "grayscale" : "hover:scale-105"
            }`}
            priority={false}
          />

          {isMaintenance && (
            <div className="absolute inset-0 bg-[#23251d]/55 flex items-center justify-center px-4">
              <span className="font-[family-name:var(--font-ibm-plex-sans-variable)] text-white font-extrabold tracking-[0.18em] uppercase text-[13px] sm:text-sm text-center leading-tight border border-white/70 bg-black/25 px-3 py-1.5 rounded-[3px]">
                Dalam Perbaikan
              </span>
            </div>
          )}

          <div className="absolute bottom-2.5 left-2.5 bg-[rgba(235,157,42,0.12)] text-[#b17816] text-[11px] font-semibold uppercase tracking-[0.3px] px-2 py-0.5 rounded-[4px] backdrop-blur-xs">
            {formatFacilityType(facility.type)}
          </div>
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-[family-name:var(--font-open-runde)] font-bold text-[15px] text-[#23251d] line-clamp-1">
            {facility.name}
          </h3>

          <div className="space-y-1 text-[12px] text-[#65675e]">
            <p className="font-medium text-[#23251d] truncate">{facility.location}</p>
            <p className="text-[#65675e]">
              {facility.capacity ? `Kapasitas: ${facility.capacity} orang` : "Kapasitas: Tanpa batas"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          type="button"
          onClick={() => onViewDetail?.(facility)}
          className="w-full relative top-0 flex items-center justify-center bg-[#eb9d2a] hover:bg-[#df9323] text-[#23251d] font-semibold text-[13px] py-[7px] px-4 rounded-[6px] transition-all duration-100 cursor-pointer border border-[#d88c22] shadow-[0_2.5px_0_0_#b17816] active:top-[1.5px] active:shadow-none"
        >
          Lihat Detail
        </button>
      </div>
    </div>
  );
}
