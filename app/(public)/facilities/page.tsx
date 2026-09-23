"use client";

import { useState, useEffect } from "react";
import { Building2, X, Calendar as CalendarIcon, Info } from "lucide-react";
import FacilityCard from "@/components/facilities/FacilityCard";
import FacilityFilter from "@/components/facilities/FacilityFilter";
import SlotGrid from "@/components/facilities/SlotGrid";
import TagPill from "@/components/ui/TagPill";
import { Facility, SlotAvailability } from "@/types";
import { formatFacilityType } from "@/lib/utils";

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    capacity: "",
    status: "",
  });

  // Modal availability state
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [targetDate, setTargetDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [slots, setSlots] = useState<SlotAvailability[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const params = new URLSearchParams();
        if (filters.search) params.set("search", filters.search);
        if (filters.type) params.set("type", filters.type);
        if (filters.capacity) params.set("capacity", filters.capacity);
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

  const fetchAvailability = async (facilityId: number, dateStr: string) => {
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/facilities/${facilityId}/availability?date=${dateStr}`);
      const data = await res.json();
      if (data?.data?.slots) {
        setSlots(data.data.slots);
      } else {
        setSlots([]);
      }
    } catch (err) {
      console.error("Gagal memuat ketersediaan slot:", err);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleOpenAvailability = (fac: Facility) => {
    setSelectedFacility(fac);
    fetchAvailability(fac.id, targetDate);
  };

  const handleDateChange = (newDate: string) => {
    setTargetDate(newDate);
    if (selectedFacility) {
      fetchAvailability(selectedFacility.id, newDate);
    }
  };

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
    });
  };

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-5 h-5 text-[#eb9d2a]" />
          <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight">
            Katalog Fasilitas Kampus
          </h1>
        </div>
        <p className="text-[14px] text-[#4B5563]">
          Eksplorasi sarana prasarana FSM Undip dan periksa ketersediaan 26 slot waktu operasional (07:00 – 20:00).
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
              onCheckAvailability={handleOpenAvailability}
            />
          ))}
        </div>
      )}

      {/* Availability Modal (PostHog Application Window Style) */}
      {selectedFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-[#bfc1b7] rounded-[6px] shadow-lg w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Title Bar */}
            <div className="bg-[#fdfdf8] border-b border-[#bfc1b7] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#eb9d2a]" />
                <span className="font-bold text-sm text-[#111827]">
                  Ketersediaan Slot: {selectedFacility.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFacility(null)}
                className="text-[#65675e] hover:text-[#111827] p-1 rounded hover:bg-black/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#eeefe9]/50 p-3 rounded-[4px] border border-[#d1d5db]">
                <div className="text-xs space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#111827]">{selectedFacility.location}</span>
                    <TagPill status={selectedFacility.status} />
                  </div>
                  <p className="text-[#65675e]">
                    Tipe: {formatFacilityType(selectedFacility.type)}
                    {selectedFacility.capacity ? ` • Kapasitas: ${selectedFacility.capacity} orang` : ""}
                  </p>
                </div>

                {/* Date Picker */}
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-[#eb9d2a]" />
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="px-2.5 py-1 text-xs font-mono font-medium border border-[#bfc1b7] rounded-[4px] bg-white text-[#23251d] focus:outline-none focus:border-[#111827]"
                  />
                </div>
              </div>

              {/* Slot Matrix */}
              <SlotGrid slots={slots} isLoading={loadingSlots} />

              <div className="pt-2 text-[11px] text-[#65675e] border-t border-[#eeefe9] flex items-center justify-between">
                <span>* Status slot diperbarui otomatis sesuai jadwal reservasi yang telah disetujui.</span>
                <button
                  type="button"
                  onClick={() => setSelectedFacility(null)}
                  className="px-3 py-1 font-semibold text-xs border border-[#bfc1b7] rounded-[4px] hover:bg-[#fdfdf8] cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
