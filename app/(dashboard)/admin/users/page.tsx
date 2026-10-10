"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import Button from "@/views/ui/Button";
import Input from "@/views/ui/Input";
import Select from "@/views/ui/Select";
import Modal from "@/views/ui/Modal";
import Table from "@/views/ui/Table";
import TagPill from "@/views/ui/TagPill";
import { USER_STATUS_LABELS, ROLE_LABELS } from "@/app/model/constants";
import { formatDate } from "@/app/model/utils";

type UserData = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
};

type Tab = "pending" | "all";

/**
 * DESIGN.md — Admin Users page
 * H1: §2.2 — 22px, weight 800, letterSpacing -0.5px, color #111827
 * Tab Bar: §4.3 — Container bg #f5f5f0, padding 3px, radius 6px, border #e5e7e0
 * Active tab: bg #ffffff, weight 600, color #23251d, shadow
 * Inactive tab: bg transparent, weight 500, color #65675e
 */
export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("pengguna");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formGeneralError, setFormGeneralError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = activeTab === "pending" ? "?status=pending" : "";
      const res = await fetch(`/controller/users${params}`);
      const data = await res.json();
      if (data.success) setUsers(data.data);
    } catch {
      /* empty */
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const params = activeTab === "pending" ? "?status=pending" : "";
        const res = await fetch(`/controller/users${params}`);
        const data = await res.json();
        if (!cancelled && data.success) setUsers(data.data);
      } catch {
        /* empty */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  async function handleUpdateStatus(
    userId: number,
    status: "verified" | "rejected"
  ) {
    setActionLoading(userId);
    try {
      const res = await fetch(`/controller/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) await fetchUsers();
    } catch {
      /* empty */
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDeleteUser(userId: number) {
    setActionLoading(userId);
    try {
      const res = await fetch(`/controller/users/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Gagal menghapus user");
        return;
      }
      await fetchUsers();
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleCreateUser(e: FormEvent) {
    e.preventDefault();
    setFormErrors({});
    setFormGeneralError("");
    setCreateLoading(true);

    try {
      const res = await fetch("/controller/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          role: newRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const fieldErrors: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(data.errors)) {
            fieldErrors[key] = (msgs as string[])[0];
          }
          setFormErrors(fieldErrors);
        } else {
          setFormGeneralError(data.error || "Gagal membuat user");
        }
        return;
      }

      setModalOpen(false);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("pengguna");
      await fetchUsers();
    } catch {
      setFormGeneralError("Terjadi kesalahan. Coba lagi.");
    } finally {
      setCreateLoading(false);
    }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "pending", label: "Menunggu Verifikasi" },
    { key: "all", label: "Semua User" },
  ];

  const columns = [
    { key: "name", header: "Nama" },
    { key: "email", header: "Email" },
    {
      key: "role",
      header: "Role",
      render: (row: UserData) => (
        <span
          style={{
            fontSize: "13px",
            fontFamily: "'IBM Plex Sans Variable', sans-serif",
          }}
        >
          {ROLE_LABELS[row.role] || row.role}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: UserData) => (
        <TagPill variant={row.status as "pending" | "verified" | "rejected"}>
          {USER_STATUS_LABELS[row.status] || row.status}
        </TagPill>
      ),
    },
    {
      key: "createdAt",
      header: "Terdaftar",
      render: (row: UserData) => (
        <span
          style={{
            fontSize: "12px",
            color: "#65675e",
            fontFamily: "'IBM Plex Sans Variable', sans-serif",
          }}
        >
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    ...(activeTab === "pending"
      ? [
          {
            key: "actions",
            header: "Aksi",
            render: (row: UserData) => (
              <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                <Button
                  size="sm"
                  variant="primary"
                  loading={actionLoading === row.id}
                  onClick={() => handleUpdateStatus(row.id, "verified")}
                >
                  Verifikasi
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  loading={actionLoading === row.id}
                  onClick={() => handleUpdateStatus(row.id, "rejected")}
                >
                  Tolak
                </Button>
              </div>
            ),
          },
        ]
      : [
          {
            key: "actions",
            header: "Aksi",
            render: (row: UserData) => (
              <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                {row.role !== "admin" ? (
                  <Button
                    size="sm"
                    variant="danger"
                    loading={actionLoading === row.id}
                    onClick={() => {
                      if (
                        confirm(
                          `Yakin ingin menghapus akun "${row.name}"? Data terkait akun ini akan dihapus.`
                        )
                      ) {
                        handleDeleteUser(row.id);
                      }
                    }}
                  >
                    Hapus
                  </Button>
                ) : (
                  <span style={{ fontSize: "12px", color: "#65675e" }}>—</span>
                )}
              </div>
            ),
          },
        ]),
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "#111827",
            letterSpacing: "-0.5px",
            fontFamily: "'Open Runde', sans-serif",
          }}
        >
          Kelola User
        </h1>
        <Button onClick={() => setModalOpen(true)}>Buat User Baru</Button>
      </div>

      {/* Tab Bar — §4.3 */}
      <div
        style={{
          backgroundColor: "#f5f5f0",
          padding: "3px",
          borderRadius: "6px",
          border: "1px solid #e5e7e0",
          display: "inline-flex",
          gap: "4px",
          alignSelf: "flex-start",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "5px 12px",
              fontSize: "12px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontFamily: "'IBM Plex Sans Variable', sans-serif",
              fontWeight: activeTab === tab.key ? 600 : 500,
              color: activeTab === tab.key ? "#23251d" : "#65675e",
              backgroundColor: activeTab === tab.key ? "#ffffff" : "transparent",
              boxShadow:
                activeTab === tab.key
                  ? "0 1px 2px rgba(0,0,0,0.06)"
                  : "none",
              transition: "all 0.15s ease",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content with tab animation */}
      <div
        key={activeTab}
        style={{
          animation: "reservationTabFade 0.16s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 24px",
              color: "#65675e",
              fontSize: "13px",
              fontFamily: "'IBM Plex Sans Variable', sans-serif",
            }}
          >
            Memuat data...
          </div>
        ) : (
          <Table
            columns={columns}
            data={users}
            keyField="id"
            emptyMessage={
              activeTab === "pending"
                ? "Tidak ada akun yang menunggu verifikasi"
                : "Belum ada user terdaftar"
            }
          />
        )}
      </div>

      {/* Create User Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Buat User Baru"
      >
        {/* Error Banner — §4.12 */}
        {formGeneralError && (
          <div
            style={{
              marginBottom: "16px",
              borderRadius: "6px",
              border: "1px solid rgba(245,78,0,0.25)",
              backgroundColor: "#fef2f2",
              padding: "10px 14px",
              fontSize: "13px",
              color: "#f54e00",
              fontFamily: "'IBM Plex Sans Variable', sans-serif",
            }}
          >
            {formGeneralError}
          </div>
        )}

        <form
          onSubmit={handleCreateUser}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <Input
            label="Nama Lengkap"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            error={formErrors.name}
            required
          />
          <Input
            label="Email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            error={formErrors.email}
            required
          />
          <Input
            label="Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            error={formErrors.password}
            required
          />
          <Select
            label="Role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            options={[
              { value: "pengguna", label: "Pengguna" },
              { value: "petugas", label: "Petugas" },
            ]}
            error={formErrors.role}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              marginTop: "8px",
            }}
          >
            <Button
              variant="ghost"
              type="button"
              onClick={() => setModalOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" loading={createLoading}>
              Buat User
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
