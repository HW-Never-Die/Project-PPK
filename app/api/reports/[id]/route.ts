import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { updateReportSchema } from "@/lib/validations/report";

const mockUser = { id: 2, role: "petugas" as const };

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const reportId = parseInt(id, 10);

  if (isNaN(reportId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const report = await prisma.report.findUnique({
    where: { id: reportId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      facility: { select: { id: true, name: true, location: true } },
      processor: { select: { id: true, name: true } },
    },
  });

  if (!report) {
    return NextResponse.json({ error: "Laporan tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ data: report });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const reportId = parseInt(id, 10);

  if (isNaN(reportId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = updateReportSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { status, resolution_notes } = parsed.data;

  const existing = await prisma.report.findUnique({ where: { id: reportId } });
  if (!existing) {
    return NextResponse.json({ error: "Laporan tidak ditemukan" }, { status: 404 });
  }

  const report = await prisma.report.update({
    where: { id: reportId },
    data: {
      status,
      resolutionNotes: resolution_notes ?? null,
      processedBy: mockUser.id,
      processedAt: new Date(),
    },
    include: {
      facility: { select: { id: true, name: true } },
      processor: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ data: report });
}
