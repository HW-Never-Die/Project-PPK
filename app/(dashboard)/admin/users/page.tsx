"use client";

import { useState, useEffect, useCallback, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Modal from "@/components/ui/Modal";
import Table from "@/components/ui/Table";
import TagPill from "@/components/ui/TagPill";
import { USER_STATUS_LABELS, ROLE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

type UserData = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
};

type Tab = "pending" | "all";

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
      const res = await fetch(`/api/users${params}`);
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
        const res = await fetch(`/api/users${params}`);
        const data = await res.json();
        if (!cancelled && data.success) setUsers(data.data);
      } catch {
        /* empty */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [activeTab]);

  async function handleUpdateStatus(
    userId: number,
    status: "verified" | "rejected"
  ) {
    setActionLoading(userId);
    try {
      const res = await fetch(`/api/users/${userId}`, {
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
      const res = await fetch(`/api/users/${userId}`, {
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
      const res = await fetch("/api/users", {
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

  const columns = [
    { key: "name", header: "Nama" },
    { key: "email", header: "Email" },
    {
      key: "role",
      header: "Role",
      render: (row: UserData) => (
        <span className="text-caption">{ROLE_LABELS[row.role] || row.role}</span>
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
        <span className="text-micro text-sage-gray">
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
              <div className="flex justify-center gap-2">
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
              <div className="flex justify-center gap-2">
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
                  <span className="text-micro text-sage-gray">—</span>
                )}
              </div>
            ),
          },
        ]),
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-heading-lg font-bold tracking-heading-lg text-deep-moss">
          Kelola User
        </h1>
        <Button onClick={() => setModalOpen(true)}>Buat User Baru</Button>
      </div>

      <div className="flex gap-1 mb-4">
        {(
          [
            { key: "pending", label: "Menunggu Verifikasi" },
            { key: "all", label: "Semua User" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-2 text-caption font-medium font-ibm-plex-sans-variable rounded-t-md transition-colors duration-150 cursor-pointer ${
              activeTab === tab.key
                ? "bg-paper-white text-signal-blue border-b-2 border-signal-blue"
                : "text-sage-gray hover:text-deep-moss"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-sage-gray">
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

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Buat User Baru"
      >
        {formGeneralError && (
          <div className="mb-4 rounded-md border border-flame-orange/30 bg-flame-orange/10 px-3 py-2 text-caption text-flame-orange">
            {formGeneralError}
          </div>
        )}

        <form onSubmit={handleCreateUser} className="flex flex-col gap-4">
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

          <div className="flex justify-end gap-2 mt-2">
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
