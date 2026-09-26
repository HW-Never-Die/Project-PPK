import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hash = (pw: string) => bcrypt.hashSync(pw, 10);

  // Seed atau update user dasar
  const users = [
    { name: "Administrator", email: "admin@eunomia.ac.id", password: hash("admin123"), role: "admin" as const, status: "verified" as const },
    { name: "Petugas Satu", email: "petugas1@eunomia.ac.id", password: hash("petugas123"), role: "petugas" as const, status: "verified" as const },
    { name: "Budi Santoso", email: "budi@student.ac.id", password: hash("user123"), role: "pengguna" as const, status: "verified" as const },
    { name: "Siti Rahayu", email: "siti@student.ac.id", password: hash("user123"), role: "pengguna" as const, status: "verified" as const },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { status: "verified", name: u.name, role: u.role },
      create: u,
    });
  }

  // Bersihkan data relasi sebelum reset fasilitas
  await prisma.reservation.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.facility.deleteMany({});

  // Tepat 20 fasilitas dummy kontekstual
  const facilitiesData = [
    // 1 Aula
    {
      name: "Aula Gedung AP",
      type: "aula" as const,
      location: "Gedung Acintya Prasada, Lantai 1",
      capacity: 250,
      description: "Aula utama serbaguna Gedung Acintya Prasada dilengkapi tata suara profesional, AC sentral, podium, proyektor besar, dan kapasitas hingga 250 kursi.",
      status: "active" as const,
      imageUrl: "/images/facilities/aula.webp",
    },

    // 3 Lab Komputer
    {
      name: "Lab Komputer A",
      type: "laboratorium" as const,
      location: "Gedung C, Lantai 1",
      capacity: 35,
      description: "Laboratorium Komputer A dengan 35 unit PC Core i7, koneksi LAN Gigabit, proyektor, dan AC untuk praktikum pemrograman dan komputasi dasar.",
      status: "active" as const,
      imageUrl: "/images/facilities/lab-komputer.webp",
    },
    {
      name: "Lab Komputer B",
      type: "laboratorium" as const,
      location: "Gedung C, Lantai 2",
      capacity: 35,
      description: "Laboratorium Komputer B dengan 35 unit PC spesifikasi grafis, dual monitor, dan perangkat lunak simulasi serta pengolahan data.",
      status: "active" as const,
      imageUrl: "/images/facilities/lab-komputer.webp",
    },
    {
      name: "Lab Komputer C",
      type: "laboratorium" as const,
      location: "Gedung C, Lantai 3",
      capacity: 30,
      description: "Laboratorium Komputer C khusus riset tingkat lanjut, jaringan komputer terapan, kecerdasan buatan, dan server komputasi lokal.",
      status: "active" as const,
      imageUrl: "/images/facilities/lab-komputer.webp",
    },

    // 10 Ruang Kelas (Format penamaan A101 = Gedung A Lantai 1 Ruang 1)
    {
      name: "Ruang A101",
      type: "ruang_kelas" as const,
      location: "Gedung A, Lantai 1",
      capacity: 40,
      description: "Ruang 1 di Gedung A Lantai 1 berkapasitas 40 mahasiswa, dilengkapi 2 unit pendingin ruangan (AC), proyektor plafon HDMI, dan whiteboard.",
      status: "active" as const,
      imageUrl: "/images/facilities/ruang-kelas.webp",
    },
    {
      name: "Ruang A102",
      type: "ruang_kelas" as const,
      location: "Gedung A, Lantai 1",
      capacity: 40,
      description: "Ruang 2 di Gedung A Lantai 1 berkapasitas 40 mahasiswa dengan pencahayaan alami optimal, AC, dan proyektor presentasi.",
      status: "active" as const,
      imageUrl: "/images/facilities/ruang-kelas.webp",
    },
    {
      name: "Ruang A201",
      type: "ruang_kelas" as const,
      location: "Gedung A, Lantai 2",
      capacity: 35,
      description: "Ruang 1 di Gedung A Lantai 2 berkapasitas 35 kursi kuliah ergonomis, ber-AC, dan mendukung kegiatan perkuliahan multimedia.",
      status: "active" as const,
      imageUrl: "/images/facilities/ruang-kelas.webp",
    },
    {
      name: "Ruang A202",
      type: "ruang_kelas" as const,
      location: "Gedung A, Lantai 2",
      capacity: 35,
      description: "Ruang 2 di Gedung A Lantai 2 berkapasitas 35 mahasiswa dengan smart board, proyektor gantung, dan pendingin ruangan ganda.",
      status: "active" as const,
      imageUrl: "/images/facilities/ruang-kelas.webp",
    },
    {
      name: "Ruang B101",
      type: "ruang_kelas" as const,
      location: "Gedung B, Lantai 1",
      capacity: 45,
      description: "Ruang 1 di Gedung B Lantai 1 bertipe teater mini berkapasitas 45 orang dengan sistem pengeras suara terintegrasi dan proyektor lebar.",
      status: "active" as const,
      imageUrl: "/images/facilities/ruang-kelas.webp",
    },
    {
      name: "Ruang B102",
      type: "ruang_kelas" as const,
      location: "Gedung B, Lantai 1",
      capacity: 40,
      description: "Ruang 2 di Gedung B Lantai 1 berkapasitas 40 orang untuk kuliah umum, diskusi kelompok, dan seminar kelas.",
      status: "active" as const,
      imageUrl: "/images/facilities/ruang-kelas.webp",
    },
    {
      name: "Ruang B201",
      type: "ruang_kelas" as const,
      location: "Gedung B, Lantai 2",
      capacity: 35,
      description: "Ruang 1 di Gedung B Lantai 2 dengan meja modular fleksibel untuk diskusi interaktif kelompok berkapasitas 35 mahasiswa.",
      status: "active" as const,
      imageUrl: "/images/facilities/ruang-kelas.webp",
    },
    {
      name: "Ruang C101",
      type: "ruang_kelas" as const,
      location: "Gedung C, Lantai 1",
      capacity: 40,
      description: "Ruang 1 di Gedung C Lantai 1 berdekatan dengan koridor laboratorium, berkapasitas 40 kursi dengan fasilitas proyektor HDMI.",
      status: "active" as const,
      imageUrl: "/images/facilities/ruang-kelas.webp",
    },
    {
      name: "Ruang C102",
      type: "ruang_kelas" as const,
      location: "Gedung C, Lantai 1",
      capacity: 40,
      description: "Ruang 2 di Gedung C Lantai 1 berkapasitas 40 kursi, dilengkapi AC ganda, whiteboard kaca, dan sound system kelas.",
      status: "active" as const,
      imageUrl: "/images/facilities/ruang-kelas.webp",
    },
    {
      name: "Ruang C201",
      type: "ruang_kelas" as const,
      location: "Gedung C, Lantai 2",
      capacity: 30,
      description: "Ruang 1 di Gedung C Lantai 2 berkapasitas 30 mahasiswa, cocok untuk kelas tutorial, bimbingan, dan ujian komprehensif.",
      status: "active" as const,
      imageUrl: "/images/facilities/ruang-kelas.webp",
    },

    // 3 Lapangan Olahraga
    {
      name: "Lapangan Basket",
      type: "lapangan" as const,
      location: "Area Olahraga Terbuka FSM",
      capacity: 50,
      description: "Lapangan basket outdoor standar dengan lantai beton cor halus, tiang dan papan pantul profesional, serta lampu penerangan malam.",
      status: "active" as const,
      imageUrl: "/images/facilities/lapangan-basket.webp",
    },
    {
      name: "Lapangan Futsal",
      type: "lapangan" as const,
      location: "Area Olahraga Outdoor",
      capacity: 30,
      description: "Lapangan futsal outdoor beralaskan semen halus dengan jaring pengaman keliling, gawang standar, dan garis pembatas jelas.",
      status: "active" as const,
      imageUrl: "https://images.unsplash.com/photo-1529900244469-99d9198647e3?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Lapangan Voli",
      type: "lapangan" as const,
      location: "Area Olahraga Outdoor",
      capacity: 30,
      description: "Lapangan voli outdoor dengan tiang net standar PBVSI dan area servis representatif untuk latihan maupun turnamen kampus.",
      status: "active" as const,
      imageUrl: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80",
    },

    // 3 Alat Elektronik
    {
      name: "Proyektor Portable A",
      type: "alat" as const,
      location: "Gudang Alat Gedung A",
      capacity: null,
      description: "Unit proyektor Epson 3600 Lumens portabel resolusi XGA/HDMI, lengkap dengan tas pembawa, kabel HDMI 10m, dan kabel daya.",
      status: "active" as const,
      imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Proyektor Portable B",
      type: "alat" as const,
      location: "Gudang Alat Gedung B",
      capacity: null,
      description: "Unit proyektor BenQ Full HD 1080p portabel dengan kecerahan tinggi, input dual HDMI/Type-C, dan remote control.",
      status: "active" as const,
      imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Sound System Portable",
      type: "alat" as const,
      location: "Gudang Alat Gedung A",
      capacity: null,
      description: "Paket trolley speaker portable bertenaga baterai isi ulang, dilengkapi 2 unit microphone wireless UHF dan input bluetooth.",
      status: "active" as const,
      imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80",
    },
  ];

  await prisma.facility.createMany({
    data: facilitiesData,
  });

  console.log(`Seed completed: ${facilitiesData.length} facilities created.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
