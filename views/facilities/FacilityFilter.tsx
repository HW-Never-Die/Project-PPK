"use client";

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
    <div className="bg-white border border-[#e5e7e0] rounded-[8px] p-4 mb-6 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {/* Search */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[0.3px] text-[#65675e] mb-[6px]">
            Pencarian
          </label>
          <input
            type="text"
            placeholder="Cari nama, gedung..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="w-full px-3 py-[7px] text-[13px] border border-[#bfc1b7] rounded-[6px] bg-white text-[#23251d] placeholder:text-[#9ea096] focus:outline-none focus:border-[#eb9d2a] transition-[border-color] duration-150"
          />
        </div>

        {/* Tipe Fasilitas */}
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-[0.3px] text-[#65675e] mb-[6px]">
            Tipe Fasilitas
          </label>
          <select
            value={filters.type}
            onChange={(e) => onChange({ ...filters, type: e.target.value })}
            className="w-full px-3 py-[7px] text-[13px] border border-[#bfc1b7] rounded-[6px] bg-white text-[#23251d] focus:outline-none focus:border-[#eb9d2a] transition-[border-color] duration-150"
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
          <label className="block text-[11px] font-semibold uppercase tracking-[0.3px] text-[#65675e] mb-[6px]">
            Kapasitas Minimal
          </label>
          <select
            value={filters.capacity}
            onChange={(e) => onChange({ ...filters, capacity: e.target.value })}
            className="w-full px-3 py-[7px] text-[13px] border border-[#bfc1b7] rounded-[6px] bg-white text-[#23251d] focus:outline-none focus:border-[#eb9d2a] transition-[border-color] duration-150"
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
          <label className="block text-[11px] font-semibold uppercase tracking-[0.3px] text-[#65675e] mb-[6px]">
            Urutkan
          </label>
          <select
            value={filters.sort || "name_asc"}
            onChange={(e) => onChange({ ...filters, sort: e.target.value })}
            className="w-full px-3 py-[7px] text-[13px] border border-[#bfc1b7] rounded-[6px] bg-white text-[#23251d] focus:outline-none focus:border-[#eb9d2a] transition-[border-color] duration-150"
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
              <label className="block text-[11px] font-semibold uppercase tracking-[0.3px] text-[#65675e] mb-[6px]">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => onChange({ ...filters, status: e.target.value })}
                className="w-full px-3 py-[7px] text-[13px] border border-[#bfc1b7] rounded-[6px] bg-white text-[#23251d] focus:outline-none focus:border-[#eb9d2a] transition-[border-color] duration-150"
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
              className="w-full relative top-0 flex items-center justify-center px-3 py-[7px] text-[13px] font-semibold text-[#4d4f46] bg-[#ffffff] hover:bg-[#f5f5f0] hover:border-[#bfc1b7] border border-[#d1d5db] rounded-[6px] transition-all duration-100 cursor-pointer h-[34px] shadow-[0_2px_0_0_#d1d1c9] active:top-[1.5px] active:shadow-none"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
