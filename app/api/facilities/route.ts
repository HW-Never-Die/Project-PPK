import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");

  const facilities = await prisma.facility.findMany({
    where: {
      ...(type ? { type: type as "ruang_kelas" | "aula" | "laboratorium" | "alat" | "lapangan" } : {}),
      ...(status ? { status: status as "active" | "maintenance" | "inactive" } : {}),
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ data: facilities });
}
