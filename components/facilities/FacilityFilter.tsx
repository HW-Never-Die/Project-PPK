"use client";

import { Search, RotateCcw } from "lucide-react";

interface FilterState {
  search: string;
  type: string;
  capacity: string;
  status: string;
  sort: string;
}

interface FacilityFilterProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  showStatusFilter?: boolean;
}

export default function FacilityFilter({
  filters,
  onChange,
  onReset,
  showStatusFilter = false,
}: FacilityFilterProps) {
  return (
    <div className="bg-white border border-[#bfc1b7] rounded-[4px] p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative">
          <label className="block text-[11px] font-bold text-[#65675e] uppercase tracking-wider mb-1">
            Pencarian
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#65675e]" />
            <input
              type="text"
              placeholder="Cari nama, gedung..."
              value={filters.search}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              className="w-full pl-8 pr-3 py-1.5 text-[13px] border border-[#bfc1b7] rounded-[4px] bg-white text-[#23251d] focus:outline-none focus:border-[#111827]"
            />
          </div>
        </div>

        {/* Tipe Fasilitas */}
        <div>
          <label className="block text-[11px] font-bold text-[#65675e] uppercase tracking-wider mb-1">
            Tipe Fasilitas
          </label>
          <select
            value={filters.type}
            onChange={(e) => onChange({ ...filters, type: e.target.value })}
            className="w-full px-3 py-1.5 text-[13px] border border-[#bfc1b7] rounded-[4px] bg-white text-[#23251d] focus:outline-none focus:border-[#111827]"
          >
            <option value="">Semua Tipe</option>
            <option value="ruang_kelas">Ruang Kelas</option>
            <option value="aula">Aula</option>
            <option value="laboratorium">Laboratorium</option>
            <option value="alat">Alat / Elektronik</option>
            <option value="lapangan">Lapangan Olahraga</option>
          </select>
        </div>

        {/* Min Kapasitas */}
        <div>
          <label className="block text-[11px] font-bold text-[#65675e] uppercase tracking-wider mb-1">
            Kapasitas Minimal
          </label>
          <select
            value={filters.capacity}
            onChange={(e) => onChange({ ...filters, capacity: e.target.value })}
            className="w-full px-3 py-1.5 text-[13px] border border-[#bfc1b7] rounded-[4px] bg-white text-[#23251d] focus:outline-none focus:border-[#111827]"
          >
            <option value="">Semua Kapasitas</option>
            <option value="20">&ge; 20 Orang</option>
            <option value="30">&ge; 30 Orang</option>
            <option value="50">&ge; 50 Orang</option>
            <option value="100">&ge; 100 Orang</option>
          </select>
        </div>

        {/* Sorting Control */}
        <div>
          <label className="block text-[11px] font-bold text-[#65675e] uppercase tracking-wider mb-1">
            Urutkan
          </label>
          <select
            value={filters.sort || "name_asc"}
            onChange={(e) => onChange({ ...filters, sort: e.target.value })}
            className="w-full px-3 py-1.5 text-[13px] border border-[#bfc1b7] rounded-[4px] bg-white text-[#23251d] focus:outline-none focus:border-[#111827]"
          >
            <option value="name_asc">Nama (A - Z)</option>
            <option value="name_desc">Nama (Z - A)</option>
            <option value="capacity_desc">Kapasitas Terbesar</option>
            <option value="capacity_asc">Kapasitas Terkecil</option>
            <option value="newest">Terbaru Ditambahkan</option>
          </select>
        </div>

        {/* Status (if admin) or Reset Button */}
        <div className="flex flex-col justify-end">
          {showStatusFilter ? (
            <div>
              <label className="block text-[11px] font-bold text-[#65675e] uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => onChange({ ...filters, status: e.target.value })}
                className="w-full px-3 py-1.5 text-[13px] border border-[#bfc1b7] rounded-[4px] bg-white text-[#23251d] focus:outline-none focus:border-[#111827]"
              >
                <option value="">Semua Status</option>
                <option value="active">Aktif</option>
                <option value="maintenance">Perbaikan</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
          ) : (
            <button
              type="button"
              onClick={onReset}
              className="w-full flex items-center justify-center gap-1 px-3 py-1.5 text-[13px] font-semibold text-[#4B5563] bg-[#eeefe9] hover:bg-[#e1d7c2] border border-[#bfc1b7] rounded-[4px] transition-colors cursor-pointer h-[34px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
