import type { Metadata } from "next";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eunomia — Sistem Fasilitas & Pelaporan Kampus FSM Undip",
  description:
    "Sistem Reservasi & Pelaporan Fasilitas Kampus Terpadu Fakultas Sains dan Matematika Undip",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#eeefe9] font-sans text-[#23251d]">
        <AuthProvider>
          <Navbar />
          <div className="flex-1 flex flex-col relative z-0">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
