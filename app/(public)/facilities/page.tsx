"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Info } from "lucide-react";
import FacilityCard from "@/components/facilities/FacilityCard";
import FacilityFilter from "@/components/facilities/FacilityFilter";
import TagPill from "@/components/ui/TagPill";
import { Facility } from "@/types";
import { formatFacilityType } from "@/lib/utils";

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    capacity: "",
    status: "",
    sort: "name_asc",
  });

  // Modal floating detail state
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  const defaultImages: Record<string, string> = {
    ruang_kelas: "/images/facilities/ruang-kelas.webp",
    laboratorium: "/images/facilities/lab-komputer.webp",
    aula: "/images/facilities/aula.webp",
    lapangan: "/images/facilities/lapangan-basket.webp",
    alat: "/images/facilities/no-image.webp",
  };

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        if (filters.type) params.set("type", filters.type);
        if (filters.capacity) params.set("capacity", filters.capacity);
        if (filters.sort) params.set("sort", filters.sort);
        params.set("status", "active");

        const res = await fetch(`/api/facilities?${params.toString()}`);
        const data = await res.json();
        if (!ignore && data?.data) {
          setFacilities(data.data);
        }
      } catch (err) {
        console.error("Gagal memuat data fasilitas:", err);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [filters]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setLoading(true);
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setLoading(true);
    setFilters({
      search: "",
      type: "",
      capacity: "",
      status: "",
      sort: "name_asc",
    });
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight mb-1">
          Katalog Fasilitas Kampus
        </h1>
        <p className="text-[14px] text-[#4B5563]">
          Eksplorasi sarana prasarana FSM Undip dan temukan detail informasi kapasitas serta fasilitas yang dapat direservasi.
        </p>
      </div>

      {/* Filter Component */}
      <FacilityFilter
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Facility Grid */}
      {loading ? (
        <div className="py-20 text-center text-[#65675e]">
          <div className="inline-block w-8 h-8 border-2 border-[#eb9d2a] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-medium">Memuat katalog fasilitas...</p>
        </div>
      ) : facilities.length === 0 ? (
        <div className="bg-white border border-[#bfc1b7] rounded-[4px] p-12 text-center text-[#65675e] space-y-2">
          <Info className="w-8 h-8 text-[#eb9d2a] mx-auto mb-1" />
          <h3 className="font-bold text-base text-[#111827]">Fasilitas Tidak Ditemukan</h3>
          <p className="text-xs max-w-md mx-auto">
            Tidak ada fasilitas yang cocok dengan filter pencarian Anda. Silakan coba atur ulang filter pencarian.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-3 inline-block px-4 py-1.5 text-xs font-semibold bg-[#eb9d2a] text-[#23251d] rounded-[4px] cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map((fac) => (
            <FacilityCard
              key={fac.id}
              facility={fac}
              onViewDetail={(item) => setSelectedFacility(item)}
            />
          ))}
        </div>
      )}

      {/* Floating Detail Page / Modal */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-[#bfc1b7] rounded-[6px] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Title Bar */}
            <div className="bg-[#fdfdf8] border-b border-[#bfc1b7] px-5 py-3.5 flex items-center justify-between shrink-0">
              <span className="font-bold text-base text-[#111827]">
                Detail Fasilitas
              </span>
              <button
                type="button"
                onClick={() => setSelectedFacility(null)}
                className="p-1.5 text-[#111827] hover:text-black bg-black/5 hover:bg-black/10 rounded-md transition-colors cursor-pointer flex items-center justify-center"
                aria-label="Tutup modal"
                title="Tutup"
              >
                <X className="w-7 h-7" strokeWidth={2.5} />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Foto Ukuran Besar */}
              <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] rounded-[4px] overflow-hidden border border-[#bfc1b7] bg-[#eeefe9]">
                <Image
                  src={
                    selectedFacility.imageUrl && selectedFacility.imageUrl.trim() !== ""
                      ? selectedFacility.imageUrl
                      : defaultImages[selectedFacility.type] || "/images/facilities/no-image.webp"
                  }
                  alt={selectedFacility.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 672px"
                  className="object-cover"
                  priority
                />
                <div className="absolute top-3 right-3">
                  <TagPill status={selectedFacility.status} />
                </div>
                <div className="absolute bottom-3 left-3 bg-[#23251d]/90 text-white text-xs font-semibold px-2.5 py-1 rounded-[3px] backdrop-blur-xs">
                  {formatFacilityType(selectedFacility.type)}
                </div>
              </div>

              {/* 3 Info Utama: Nama, Lokasi, Kapasitas */}
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
                  {selectedFacility.name}
                </h2>
                <div className="mt-2.5 flex flex-wrap items-center gap-y-2 gap-x-5 text-sm text-[#4B5563]">
                  <div>
                    <span className="font-semibold text-[#111827]">Lokasi: </span>
                    <span>{selectedFacility.location}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#111827]">Kapasitas: </span>
                    <span>
                      {selectedFacility.capacity
                        ? `${selectedFacility.capacity} orang`
                        : "Tanpa batas (Alat)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deskripsi Lengkap */}
              <div className="pt-4 border-t border-[#eeefe9] space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#65675e]">
                  Deskripsi Lengkap
                </h4>
                <p className="text-sm text-[#23251d] leading-relaxed whitespace-pre-line bg-[#fdfdf8] p-3.5 rounded-[4px] border border-[#eeefe9]">
                  {selectedFacility.description || "Tidak ada deskripsi rinci untuk fasilitas ini."}
                </p>
              </div>
            </div>

            {/* Modal Footer - Reservasi Sekarang di Ujung Kanan */}
            <div className="bg-[#fdfdf8] border-t border-[#bfc1b7] px-6 py-3.5 flex items-center justify-end shrink-0">
              <Link
                href={`/pengguna/reservasi/buat?facilityId=${selectedFacility.id}`}
                className="inline-flex items-center justify-center bg-[#eb9d2a] hover:bg-[#d88c22] text-[#23251d] font-bold text-sm py-2.5 px-5 rounded-[4px] transition-colors shadow-xs"
              >
                <span>Reservasi Sekarang</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
