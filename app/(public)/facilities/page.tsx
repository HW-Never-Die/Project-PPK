"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Info, AlertTriangle, Building2, CheckCircle2, Wrench, Layers } from "lucide-react";
import FacilityCard from "@/views/facilities/FacilityCard";
import FacilityFilter from "@/views/facilities/FacilityFilter";
import { Facility } from "@/types";
import { formatFacilityType } from "@/app/model/utils";

function StatCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 14px",
        backgroundColor: "#fdfdf8",
        border: "1px solid #e5e7e0",
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: `${color}1a`,
          color,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "11px", color: "#65675e", fontWeight: 500, fontFamily: "'IBM Plex Sans Variable', sans-serif" }}>
          {label}
        </div>
        <div style={{ fontSize: "17px", fontWeight: 700, color, fontFamily: "'Open Runde', sans-serif" }}>
          {value}
        </div>
      </div>
    </div>
  );
}

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
  const [reserveBlocked, setReserveBlocked] = useState(false);

  const isSelectedMaintenance = selectedFacility?.status === "maintenance";

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

        const res = await fetch(`/controller/facilities?${params.toString()}`);
        const data = await res.json();
        if (!ignore && data?.data) {
          // ponytail: tampilkan active + maintenance di katalog publik (filter hanya inactive).
          // Upgrade path: tambah filter status di UI katalog jika user ingin sembunyikan unit perbaikan.
          setFacilities(
            (data.data as Facility[]).filter((f) => f.status !== "inactive")
          );
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
    setReserveBlocked(false);
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setLoading(true);
    setReserveBlocked(false);
    setFilters({
      search: "",
      type: "",
      capacity: "",
      status: "",
      sort: "name_asc",
    });
  };

  const activeCount = facilities.filter((f) => f.status === "active").length;
  const maintenanceCount = facilities.filter((f) => f.status === "maintenance").length;
  const typesUsed = new Set(facilities.map((f) => f.type)).size;

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-6">
      {/* Panel background — satukan semua section (parity dgn layout dashboard) */}
      <div className="bg-white border border-[#d1d5db] rounded-lg shadow-sm p-6 min-h-[500px]" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Breadcrumb Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 12px",
          backgroundColor: "#f5f5f0",
          borderRadius: "6px",
          border: "1px solid #e5e7e0",
          fontSize: "12px",
          fontFamily: "'IBM Plex Sans Variable', sans-serif",
          color: "#65675e",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              display: "inline-block",
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#eb9d2a",
            }}
          />
          <Link href="/" style={{ color: "#23251d", textDecoration: "none", fontWeight: 600 }}>
            Eunomia OS
          </Link>
          <span>/</span>
          <span>Katalog</span>
          <span>/</span>
          <span style={{ color: "#23251d", fontWeight: 500 }}>Fasilitas</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            title="Maximize"
            style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", border: "1px solid #bfc1b7" }}
          />
          <span
            title="Close"
            style={{ display: "inline-block", width: "10px", height: "10px", borderRadius: "2px", border: "1px solid #bfc1b7" }}
          />
        </div>
      </div>

      {/* Hero Card */}
      <div
        style={{
          backgroundColor: "#fdfdf8",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          padding: "20px 24px",
        }}
      >
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          padding: "2px 8px",
          borderRadius: "4px",
          backgroundColor: "rgba(235,157,42,0.12)",
          color: "#b17816",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.3px",
          textTransform: "uppercase",
          fontFamily: "'IBM Plex Sans Variable', sans-serif",
          marginBottom: "8px",
        }}>
          <Building2 size={13} />
          Sarana Prasarana FSM Undip
        </div>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "#111827",
            letterSpacing: "-0.5px",
            margin: "0 0 6px 0",
            fontFamily: "'Open Runde', sans-serif",
          }}
        >
          Katalog Fasilitas Kampus
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#4B5563",
            fontWeight: 400,
            fontFamily: "'IBM Plex Sans Variable', sans-serif",
            lineHeight: "1.5",
            margin: 0,
            maxWidth: "680px",
          }}
        >
          Eksplorasi sarana prasarana FSM Undip dan temukan detail informasi kapasitas serta fasilitas yang dapat direservasi.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "10px" }}>
        <StatCard label="Total Fasilitas" value={facilities.length} color="#23251d" icon={<Building2 size={18} />} />
        <StatCard label="Siap Direservasi" value={activeCount} color="#3d7a1c" icon={<CheckCircle2 size={18} />} />
        <StatCard label="Dalam Perbaikan" value={maintenanceCount} color="#cd8407" icon={<Wrench size={18} />} />
        <StatCard label="Kategori Terpakai" value={typesUsed} color="#65675e" icon={<Layers size={18} />} />
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
              onViewDetail={(item) => {
                setReserveBlocked(false);
                setSelectedFacility(item);
              }}
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
                  className={`object-cover ${isSelectedMaintenance ? "grayscale" : ""}`}
                  priority
                />

                {isSelectedMaintenance && (
                  <div className="absolute inset-0 bg-[#23251d]/55 flex items-center justify-center px-4">
                    <span className="font-[family-name:var(--font-ibm-plex-sans-variable)] text-white font-extrabold tracking-[0.18em] uppercase text-sm sm:text-base text-center leading-tight border border-white/70 bg-black/25 px-3 py-1.5 rounded-[3px]">
                      Dalam Perbaikan
                    </span>
                  </div>
                )}

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
            <div className="bg-[#fdfdf8] border-t border-[#bfc1b7] px-6 py-3.5 flex flex-col gap-2.5 shrink-0">
              {reserveBlocked && isSelectedMaintenance && (
                <div className="flex items-center gap-2 text-[13px] font-medium text-[#f54e00]">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Fasilitas sedang dalam perbaikan dan belum dapat direservasi.</span>
                </div>
              )}
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => {
                    if (isSelectedMaintenance) {
                      setReserveBlocked(true);
                      return;
                    }
                    window.location.href = `/pengguna/reservasi/buat?facilityId=${selectedFacility.id}`;
                  }}
                  className={`inline-flex items-center justify-center font-bold text-sm py-2.5 px-5 rounded-[4px] transition-colors shadow-xs ${
                    isSelectedMaintenance
                      ? "bg-[#9ea096] text-white cursor-not-allowed"
                      : "bg-[#eb9d2a] hover:bg-[#d88c22] text-[#23251d]"
                  }`}
                >
                  <span>Reservasi Sekarang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
