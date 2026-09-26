"use client";

import Image from "next/image";
import TagPill from "@/components/ui/TagPill";
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

  return (
    <div className="bg-white border border-[#bfc1b7] rounded-[4px] overflow-hidden flex flex-col justify-between hover:border-[#111827] transition-colors shadow-xs">
      <div>
        <div className="relative w-full aspect-[16/9] bg-[#eeefe9] overflow-hidden">
          <Image
            src={imageSrc}
            alt={facility.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
            priority={false}
          />
          <div className="absolute top-2.5 right-2.5">
            <TagPill status={facility.status} />
          </div>
          <div className="absolute bottom-2.5 left-2.5 bg-[#23251d]/85 text-white text-[11px] font-semibold px-2 py-0.5 rounded-[3px] backdrop-blur-xs">
            {formatFacilityType(facility.type)}
          </div>
        </div>

        <div className="p-4 space-y-2">
          <h3 className="font-extrabold text-base text-[#111827] line-clamp-1">
            {facility.name}
          </h3>

          <div className="space-y-1 text-xs text-[#4B5563]">
            <p className="font-medium text-[#111827] truncate">{facility.location}</p>
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
          className="w-full flex items-center justify-center bg-[#eb9d2a] hover:bg-[#d88c22] text-[#23251d] font-bold text-sm py-2.5 px-4 rounded-[4px] transition-colors cursor-pointer shadow-xs"
        >
          Lihat Detail
        </button>
      </div>
    </div>
  );
}
