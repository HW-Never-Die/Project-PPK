import Image from "next/image";
import Link from "next/link";
import {
  Search,
} from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-start py-32 px-4 sm:px-16 sm:items-center relative z-0">
      <h1 className="text-4xl md:text-6xl font-extrabold text-center max-w-4xl tracking-tight mb-8">
        Website Kampus
      </h1>
      <p className="mt-6 text-xl text-gray-800 text-center max-w-2xl font-medium">
        Sistem Pelaporan Kerusakan
      </p>
    </main>
  );
}
