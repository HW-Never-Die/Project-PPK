"use client";

import { useState, useRef, useEffect } from "react";
import { Facility } from "@/types";
import { Upload, X } from "lucide-react";

type Category = "kerusakan" | "kebersihan" | "keamanan" | "lainnya";

interface ReportFormProps {
  onSuccess?: () => void;
}

export default function ReportForm({ onSuccess }: ReportFormProps) {
  const [facilityId, setFacilityId] = useState("");
  const [facilities, setFacilities] = useState<{ id: number; name: string }[]>([]);
  const [category, setCategory] = useState<Category>("kerusakan");
  const [description, setDescription] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const inputStyle = {
    width: "100%",
    padding: "6px 10px",
    border: "1px solid #bfc1b7",
    borderRadius: "4px",
    fontSize: "14px",
    color: "#23251d",
    backgroundColor: "#ffffff",
    fontFamily: "'IBM Plex Sans Variable', sans-serif",
    outline: "none",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: 500,
    color: "#4d4f46",
    marginBottom: "4px",
    fontFamily: "'IBM Plex Sans Variable', sans-serif",
  };

  useEffect(() => {
    fetch("/api/facilities")
      .then(res => res.json())
      .then(data => {
        const sorted = (data.data ?? []).sort((a: Facility, b: Facility) => a.id - b.id);
        setFacilities(sorted);
      })
      .catch(console.error);
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload gagal");
      setPhotoUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!facilityId || !description.trim()) {
      setError("Fasilitas dan deskripsi wajib diisi");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facility_id: parseInt(facilityId, 10),
          category,
          description,
          photo_url: photoUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Gagal mengirim laporan");
      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #bfc1b7",
          borderRadius: "6px",
          padding: "32px",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#6aa84f", fontSize: "19px", fontWeight: 600, marginBottom: "8px" }}>
          Laporan berhasil dikirim
        </p>
        <p style={{ color: "#65675e", fontSize: "14px" }}>
          Tim kami akan segera menindaklanjuti laporan Anda.
        </p>
        <button
          onClick={() => { setSuccess(false); setDescription(""); setPhotoPreview(null); setPhotoUrl(null); setFacilityId(""); }}
          style={{
            marginTop: "16px",
            padding: "6px 12px",
            backgroundColor: "#eb9d2a",
            color: "#23251d",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "'IBM Plex Sans Variable', sans-serif",
          }}
        >
          Buat Laporan Lain
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #bfc1b7",
        borderRadius: "6px",
        padding: "24px 32px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {error && (
        <div
          style={{
            padding: "8px 12px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fca5a5",
            borderRadius: "4px",
            color: "#f54e00",
            fontSize: "13px",
          }}
        >
          {error}
        </div>
      )}

      <div>
        <label style={labelStyle}>Fasilitas</label>
        <select
          value={facilityId}
          onChange={(e) => setFacilityId(e.target.value)}
          style={inputStyle}
          required
        >
          <option value="" disabled>Pilih Fasilitas</option>
          {facilities.map((f) => (
            <option key={f.id} value={f.id}>
              {f.id} - {f.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Kategori</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as Category)}
          style={inputStyle}
          required
        >
          <option value="kerusakan">Kerusakan</option>
          <option value="kebersihan">Kebersihan</option>
          <option value="keamanan">Keamanan</option>
          <option value="lainnya">Lainnya</option>
        </select>
      </div>

      <div>
        <label style={labelStyle}>Deskripsi Masalah</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Jelaskan masalah secara detail (minimal 10 karakter)"
          rows={4}
          style={{ ...inputStyle, resize: "vertical" }}
          required
        />
      </div>

      <div>
        <label style={labelStyle}>Foto Bukti (opsional)</label>
        <div
          onClick={() => fileRef.current?.click()}
          style={{
            border: "1px dashed #bfc1b7",
            borderRadius: "4px",
            padding: "16px",
            textAlign: "center",
            cursor: "pointer",
            backgroundColor: "#fdfdf8",
          }}
        >
          {photoPreview ? (
            <div style={{ position: "relative", display: "inline-block" }}>
              <img
                src={photoPreview}
                alt="preview"
                style={{ maxHeight: "160px", borderRadius: "4px", objectFit: "cover" }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPhotoPreview(null);
                  setPhotoUrl(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  background: "rgba(0,0,0,0.5)",
                  border: "none",
                  borderRadius: "9999px",
                  color: "#fff",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <div style={{ color: "#9ea096", fontSize: "13px" }}>
              <Upload size={20} style={{ margin: "0 auto 6px", color: "#bfc1b7" }} />
              {uploading ? "Mengunggah..." : "Klik untuk upload foto"}
            </div>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "4px" }}>
        <button
          type="submit"
          disabled={submitting || uploading}
          style={{
            padding: "6px 16px",
            backgroundColor: submitting || uploading ? "#9ea096" : "#eb9d2a",
            color: "#23251d",
            border: "none",
            borderRadius: "4px",
            fontSize: "14px",
            fontWeight: 500,
            cursor: submitting || uploading ? "not-allowed" : "pointer",
            fontFamily: "'IBM Plex Sans Variable', sans-serif",
          }}
        >
          {submitting ? "Mengirim..." : "Kirim Laporan"}
        </button>
      </div>
    </form>
  );
}
