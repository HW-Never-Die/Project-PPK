import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createReportSchema } from "@/lib/validations/report";

const mockUser = { id: 3, role: "pengguna" as const };

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const reports = await prisma.report.findMany({
    where: status ? { status: status as "new" | "in_progress" | "resolved" | "rejected" } : undefined,
    include: {
      user: { select: { id: true, name: true, email: true } },
      facility: { select: { id: true, name: true, location: true } },
      processor: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: reports });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createReportSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { facility_id, category, description, photo_url } = parsed.data;

  const facility = await prisma.facility.findUnique({ where: { id: facility_id } });
  if (!facility) {
    return NextResponse.json({ error: "Fasilitas tidak ditemukan" }, { status: 404 });
  }

  const report = await prisma.report.create({
    data: {
      userId: mockUser.id,
      facilityId: facility_id,
      category,
      description,
      photoUrl: photo_url ?? null,
      status: "new",
    },
    include: {
      facility: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ data: report }, { status: 201 });
}
