"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Building2,
  Plus,
  Pencil,
  Power,
  Search,
  X,
  AlertCircle,
} from "lucide-react";
import TagPill from "@/components/ui/TagPill";
import { Facility, FacilityType, FacilityStatus } from "@/types";
import { formatFacilityType } from "@/lib/utils";

interface FacilityFormData {
  name: string;
  type: FacilityType;
  location: string;
  capacity: string;
  description: string;
  status: FacilityStatus;
  imageUrl: string;
}

const initialForm: FacilityFormData = {
  name: "",
  type: "ruang_kelas",
  location: "",
  capacity: "",
  description: "",
  status: "active",
  imageUrl: "",
};

export default function AdminFacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [formData, setFormData] = useState<FacilityFormData>(initialForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (typeFilter) params.set("type", typeFilter);
        if (statusFilter) params.set("status", statusFilter);

        const res = await fetch(`/api/facilities?${params.toString()}`);
        const data = await res.json();
        if (!ignore && data?.data) {
          setFacilities(data.data);
        }
      } catch (err) {
        console.error("Gagal mengambil data fasilitas:", err);
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
  }, [search, typeFilter, statusFilter, reloadTrigger]);

  const refreshList = () => {
    setLoading(true);
    setReloadTrigger((prev) => prev + 1);
  };

  // Handle open add modal
  const handleOpenAdd = () => {
    setEditingFacility(null);
    setFormData(initialForm);
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEdit = (fac: Facility) => {
    setEditingFacility(fac);
    setFormData({
      name: fac.name,
      type: fac.type,
      location: fac.location,
      capacity: fac.capacity ? String(fac.capacity) : "",
      description: fac.description,
      status: fac.status,
      imageUrl: fac.imageUrl || "",
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle toggle active/inactive status
  const handleToggleStatus = async (fac: Facility) => {
    const newStatus: FacilityStatus = fac.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`/api/facilities/${fac.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        refreshList();
      } else {
        alert("Gagal memperbarui status fasilitas.");
      }
    } catch (err) {
      console.error("Error toggle status:", err);
    }
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    // Simple client validation
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Nama fasilitas wajib diisi";
    if (!formData.location.trim()) errors.location = "Lokasi fasilitas wajib diisi";
    if (!formData.description.trim()) errors.description = "Deskripsi fasilitas wajib diisi";
    if (formData.capacity && isNaN(Number(formData.capacity))) {
      errors.capacity = "Kapasitas harus berupa angka";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        type: formData.type,
        location: formData.location.trim(),
        capacity: formData.capacity ? Number(formData.capacity) : null,
        description: formData.description.trim(),
        status: formData.status,
        imageUrl: formData.imageUrl.trim() || null,
      };

      const url = editingFacility
        ? `/api/facilities/${editingFacility.id}`
        : `/api/facilities`;
      const method = editingFacility ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        if (json.details) {
          const mapped: Record<string, string> = {};
          for (const key in json.details) {
            mapped[key] = json.details[key][0];
          }
          setFormErrors(mapped);
        } else {
          alert(json.error || "Gagal menyimpan fasilitas.");
        }
        return;
      }

      setIsModalOpen(false);
      refreshList();
    } catch (err) {
      console.error("Error submit facility:", err);
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#bfc1b7]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-[#eb9d2a]" />
            <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight">
              Manajemen Master Fasilitas
            </h1>
          </div>
          <p className="text-[13px] text-[#4B5563]">
            Tambah, edit, dan perbarui status fasilitas kampus yang dapat direservasi.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-1.5 bg-[#eb9d2a] hover:bg-[#d88c22] text-[#23251d] font-bold text-xs py-2 px-4 rounded-[4px] transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Fasilitas</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#fdfdf8] p-3 border border-[#bfc1b7] rounded-[4px]">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#65675e]" />
          <input
            type="text"
            placeholder="Cari fasilitas..."
            value={search}
            onChange={(e) => {
              setLoading(true);
              setSearch(e.target.value);
            }}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-[#bfc1b7] rounded-[4px] bg-white text-[#23251d] focus:outline-none focus:border-[#111827]"
          />
        </div>

        <div>
          <select
            value={typeFilter}
            onChange={(e) => {
              setLoading(true);
              setTypeFilter(e.target.value);
            }}
            className="w-full px-3 py-1.5 text-xs border border-[#bfc1b7] rounded-[4px] bg-white text-[#23251d] focus:outline-none focus:border-[#111827]"
          >
            <option value="">Semua Tipe</option>
            <option value="ruang_kelas">Ruang Kelas</option>
            <option value="aula">Aula</option>
            <option value="laboratorium">Laboratorium</option>
            <option value="alat">Alat</option>
            <option value="lapangan">Lapangan</option>
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setLoading(true);
              setStatusFilter(e.target.value);
            }}
            className="w-full px-3 py-1.5 text-xs border border-[#bfc1b7] rounded-[4px] bg-white text-[#23251d] focus:outline-none focus:border-[#111827]"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="maintenance">Perbaikan</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Facilities Master Table */}
      <div className="border border-[#bfc1b7] rounded-[4px] overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#fdfdf8] border-b border-[#bfc1b7] text-[#65675e] font-bold">
                <th className="py-2.5 px-3 w-16">Foto</th>
                <th className="py-2.5 px-3">Nama Fasilitas</th>
                <th className="py-2.5 px-3">Tipe</th>
                <th className="py-2.5 px-3">Lokasi</th>
                <th className="py-2.5 px-3">Kapasitas</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eeefe9]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#65675e]">
                    Memuat data master fasilitas...
                  </td>
                </tr>
              ) : facilities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#65675e]">
                    Tidak ada data fasilitas ditemukan.
                  </td>
                </tr>
              ) : (
                facilities.map((fac) => {
                  const img = fac.imageUrl && fac.imageUrl.trim() !== "" ? fac.imageUrl : "/images/facilities/no-image.webp";
                  return (
                    <tr key={fac.id} className="hover:bg-[#fdfdf8] transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="relative w-12 h-9 rounded-[2px] overflow-hidden border border-[#d1d5db] bg-[#eeefe9]">
                          <Image
                            src={img}
                            alt={fac.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-[#111827]">{fac.name}</div>
                        <div className="text-[11px] text-[#65675e] line-clamp-1 max-w-xs">{fac.description}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="bg-[#eeefe9] px-2 py-0.5 rounded-[2px] font-medium text-[#23251d]">
                          {formatFacilityType(fac.type)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[#4B5563]">{fac.location}</td>
                      <td className="py-2.5 px-3 text-[#4B5563]">
                        {fac.capacity ? `${fac.capacity} orang` : "-"}
                      </td>
                      <td className="py-2.5 px-3">
                        <TagPill status={fac.status} />
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(fac)}
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-[#23251d] bg-[#eeefe9] hover:bg-[#e1d7c2] border border-[#bfc1b7] rounded-[3px] transition-colors cursor-pointer"
                        >
                          <Pencil className="w-3 h-3 text-[#65675e]" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(fac)}
                          className={`inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold border rounded-[3px] transition-colors cursor-pointer ${
                            fac.status === "active"
                              ? "bg-white hover:bg-red-50 text-red-700 border-red-200"
                              : "bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-200"
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          <span>{fac.status === "active" ? "Nonaktifkan" : "Aktifkan"}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit (PostHog Window Style) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-[#bfc1b7] rounded-[6px] shadow-lg w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Title Bar */}
            <div className="bg-[#fdfdf8] border-b border-[#bfc1b7] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#eb9d2a]" />
                <span className="font-bold text-sm text-[#111827]">
                  {editingFacility ? "Edit Data Fasilitas" : "Tambah Fasilitas Baru"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#65675e] hover:text-[#111827] p-1 rounded hover:bg-black/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
              {/* Nama */}
              <div>
                <label className="block text-xs font-bold text-[#23251d] mb-1">
                  Nama Fasilitas *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Lab Komputer 2"
                  className="w-full px-3 py-1.5 text-xs border border-[#bfc1b7] rounded-[4px] bg-white text-[#23251d] focus:outline-none focus:border-[#111827]"
                />
                {formErrors.name && (
                  <p className="text-[11px] text-red-600 mt-0.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {formErrors.name}
                  </p>
                )}
              </div>

              {/* Tipe & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#23251d] mb-1">
                    Tipe *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as FacilityType })}
                    className="w-full px-3 py-1.5 text-xs border border-[#bfc1b7] rounded-[4px] bg-white text-[#23251d] focus:outline-none focus:border-[#111827]"
                  >
                    <option value="ruang_kelas">Ruang Kelas</option>
                    <option value="aula">Aula</option>
                    <option value="laboratorium">Laboratorium</option>
                    <option value="alat">Alat</option>
                    <option value="lapangan">Lapangan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#23251d] mb-1">
                    Status Operasional
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as FacilityStatus })}
                    className="w-full px-3 py-1.5 text-xs border border-[#bfc1b7] rounded-[4px] bg-white text-[#23251d] focus:outline-none focus:border-[#111827]"
                  >
                    <option value="active">Aktif (Tersedia)</option>
                    <option value="maintenance">Perbaikan</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>

              {/* Lokasi & Kapasitas */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#23251d] mb-1">
                    Lokasi / Gedung *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Contoh: Gedung C Lantai 2"
                    className="w-full px-3 py-1.5 text-xs border border-[#bfc1b7] rounded-[4px] bg-white text-[#23251d] focus:outline-none focus:border-[#111827]"
                  />
                  {formErrors.location && (
                    <p className="text-[11px] text-red-600 mt-0.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.location}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#23251d] mb-1">
                    Kapasitas (Orang)
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="Kosongkan jika tipe alat"
                    className="w-full px-3 py-1.5 text-xs border border-[#bfc1b7] rounded-[4px] bg-white text-[#23251d] focus:outline-none focus:border-[#111827]"
                  />
                  {formErrors.capacity && (
                    <p className="text-[11px] text-red-600 mt-0.5 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {formErrors.capacity}
                    </p>
                  )}
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-xs font-bold text-[#23251d] mb-1">
                  Deskripsi Lengkap *
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Fasilitas dan kelengkapan ruangan/alat..."
                  className="w-full px-3 py-1.5 text-xs border border-[#bfc1b7] rounded-[4px] bg-white text-[#23251d] focus:outline-none focus:border-[#111827]"
                />
                {formErrors.description && (
                  <p className="text-[11px] text-red-600 mt-0.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {formErrors.description}
                  </p>
                )}
              </div>

              {/* URL Foto */}
              <div>
                <label className="block text-xs font-bold text-[#23251d] mb-1">
                  Path / URL Gambar
                </label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="/images/facilities/ruang-kelas.webp"
                  className="w-full px-3 py-1.5 text-xs border border-[#bfc1b7] rounded-[4px] bg-white text-[#23251d] focus:outline-none focus:border-[#111827]"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-[#eeefe9] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#65675e] hover:bg-[#eeefe9] rounded-[4px] transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 text-xs font-bold bg-[#eb9d2a] hover:bg-[#d88c22] text-[#23251d] rounded-[4px] transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : editingFacility ? "Simpan Perubahan" : "Buat Fasilitas"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
