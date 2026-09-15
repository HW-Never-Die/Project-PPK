import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = (pw: string) => bcrypt.hashSync(pw, 10);

  await prisma.user.createMany({
    data: [
      { name: "Administrator", email: "admin@eunomia.ac.id", password: hash("admin123"), role: "admin", status: "verified" },
      { name: "Petugas Satu", email: "petugas1@eunomia.ac.id", password: hash("petugas123"), role: "petugas", status: "verified" },
      { name: "Budi Santoso", email: "budi@student.ac.id", password: hash("user123"), role: "pengguna", status: "verified" },
      { name: "Siti Rahayu", email: "siti@student.ac.id", password: hash("user123"), role: "pengguna", status: "pending" },
    ],
    skipDuplicates: true,
  });

  await prisma.facility.createMany({
    data: [
      { name: "Ruang Kelas 101", type: "ruang_kelas", location: "Gedung A, Lantai 1", capacity: 40, description: "Ruang kelas standar dengan proyektor dan AC", status: "active" },
      { name: "Ruang Kelas 202", type: "ruang_kelas", location: "Gedung A, Lantai 2", capacity: 35, description: "Ruang kelas standar dengan proyektor dan AC", status: "active" },
      { name: "Aula Utama", type: "aula", location: "Gedung B, Lantai 1", capacity: 200, description: "Aula besar untuk acara kampus dan seminar", status: "active" },
      { name: "Lab Komputer 1", type: "laboratorium", location: "Gedung C, Lantai 1", capacity: 30, description: "Laboratorium komputer dengan 30 unit PC", status: "active" },
      { name: "Lab Fisika", type: "laboratorium", location: "Gedung C, Lantai 2", capacity: 25, description: "Laboratorium fisika dengan peralatan eksperimen", status: "active" },
      { name: "Proyektor Portable #1", type: "alat", location: "Gudang Gedung A", capacity: null, description: "Proyektor portable untuk peminjaman", status: "active" },
      { name: "Lapangan Basket", type: "lapangan", location: "Area Olahraga", capacity: 50, description: "Lapangan basket outdoor standar", status: "active" },
    ],
    skipDuplicates: true,
  });

  console.log("Seed completed");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
