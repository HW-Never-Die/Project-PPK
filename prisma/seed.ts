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

  // Reset data fasilitas dulu agar bersih
  await prisma.facility.deleteMany({});

  const ruangKelasList = [];
  const gedungs = ["A", "B", "C"];
  for (const g of gedungs) {
    for (let floor = 1; floor <= 3; floor++) {
      for (let room = 1; room <= 3; room++) {
        const roomCode = `${g}${floor}-0${room}`;
        ruangKelasList.push({
          name: `Ruang Kelas ${roomCode}`,
          type: "ruang_kelas" as const,
          location: `Gedung ${g}, Lantai ${floor}`,
          capacity: floor === 1 ? 40 : floor === 2 ? 35 : 30,
          description: `Ruang kelas ${roomCode} standar FSM Undip dengan AC dan proyektor`,
          status: "active" as const,
          imageUrl: "/images/facilities/ruang-kelas.webp",
        });
      }
    }
  }

  await prisma.facility.createMany({
    data: [
      ...ruangKelasList,
      // 3 Laboratorium (Lab A, Lab B, Lab C)
      {
        name: "Lab A",
        type: "laboratorium",
        location: "Gedung C, Lantai 1",
        capacity: 30,
        description: "Laboratorium Komputer A dengan 30 PC dan jaringan LAN",
        status: "active",
        imageUrl: "/images/facilities/lab-komputer.webp",
      },
      {
        name: "Lab B",
        type: "laboratorium",
        location: "Gedung C, Lantai 2",
        capacity: 25,
        description: "Laboratorium Sains B dengan peralatan eksperimen fisika dan kimia",
        status: "active",
        imageUrl: "/images/facilities/lab-sains.webp",
      },
      {
        name: "Lab C",
        type: "laboratorium",
        location: "Gedung C, Lantai 3",
        capacity: 30,
        description: "Laboratorium Riset Komputasi C dengan server lokal",
        status: "active",
        imageUrl: "/images/facilities/lab-komputer.webp",
      },
      // 1 Aula (tidak redundant)
      {
        name: "Aula Utama",
        type: "aula",
        location: "Gedung A, Lantai 1",
        capacity: 200,
        description: "Aula serbaguna untuk seminar, wisuda, dan kegiatan akbar",
        status: "active",
        imageUrl: "/images/facilities/aula.webp",
      },
      // 1 Lapangan Basket (tidak redundant)
      {
        name: "Lapangan Basket",
        type: "lapangan",
        location: "Area Olahraga Outdoor",
        capacity: 50,
        description: "Lapangan basket outdoor standar FSM Undip",
        status: "active",
        imageUrl: "/images/facilities/lapangan-basket.webp",
      },
      // 3 Unit Alat Portable
      {
        name: "Proyektor Portable #1",
        type: "alat",
        location: "Gudang Gedung A",
        capacity: null,
        description: "Unit proyektor portable Epson HDMI/VGA",
        status: "active",
        imageUrl: "/images/facilities/no-image.webp",
      },
      {
        name: "Proyektor Portable #2",
        type: "alat",
        location: "Gudang Gedung B",
        capacity: null,
        description: "Unit proyektor portable BenQ HDMI",
        status: "active",
        imageUrl: "/images/facilities/no-image.webp",
      },
      {
        name: "Sound System Portable",
        type: "alat",
        location: "Gudang Gedung C",
        capacity: null,
        description: "Unit portable wireless microphone + speaker aktif",
        status: "active",
        imageUrl: "/images/facilities/no-image.webp",
      },
    ],
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
