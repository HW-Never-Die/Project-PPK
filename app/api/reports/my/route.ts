import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const mockUser = { id: 3, role: "pengguna" as const };

export async function GET() {
  const reports = await prisma.report.findMany({
    where: { userId: mockUser.id },
    include: {
      facility: { select: { id: true, name: true, location: true } },
      processor: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: reports });
}
