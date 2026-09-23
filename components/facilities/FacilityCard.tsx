"use client";

import Image from "next/image";
import { MapPin, Users, Calendar, Sparkles } from "lucide-react";
import TagPill from "@/components/ui/TagPill";
import { formatFacilityType } from "@/lib/utils";
import { Facility } from "@/types";

interface FacilityCardProps {
  facility: Facility;
  onCheckAvailability?: (facility: Facility) => void;
}

export default function FacilityCard({
  facility,
  onCheckAvailability,
}: FacilityCardProps) {
  // Fallback gambar seragam sesuai tipe jika kosong atau tidak valid
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
    <div className="bg-white border border-[#bfc1b7] rounded-[4px] overflow-hidden flex flex-col justify-between hover:border-[#111827] transition-colors">
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
          <div className="absolute bottom-2.5 left-2.5 bg-[#23251d]/85 text-white text-[11px] font-semibold px-2 py-0.5 rounded-[3px] backdrop-blur-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#eb9d2a]" />
            {formatFacilityType(facility.type)}
          </div>
        </div>

        <div className="p-4 space-y-2.5">
          <h3 className="font-extrabold text-base text-[#111827] line-clamp-1">
            {facility.name}
          </h3>

          <div className="space-y-1 text-[13px] text-[#4B5563]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#65675e] shrink-0" />
              <span className="truncate">{facility.location}</span>
            </div>
            {facility.capacity ? (
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#65675e] shrink-0" />
                <span>Kapasitas {facility.capacity} orang</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-gray-400">
                <Users className="w-3.5 h-3.5 shrink-0" />
                <span>Tanpa batas kapasitas</span>
              </div>
            )}
          </div>

          <p className="text-[13px] text-[#65675e] line-clamp-2 pt-1 border-t border-[#eeefe9]">
            {facility.description}
          </p>
        </div>
      </div>

      <div className="p-4 pt-0">
        <button
          type="button"
          onClick={() => onCheckAvailability?.(facility)}
          className="w-full flex items-center justify-center gap-1.5 bg-[#eb9d2a] hover:bg-[#d88c22] text-[#23251d] font-bold text-[13px] py-2 px-3 rounded-[4px] transition-colors cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span>Cek Ketersediaan Slot</span>
        </button>
      </div>
    </div>
  );
}
