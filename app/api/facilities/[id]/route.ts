import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const patchStatusSchema = z.object({
  status: z.enum(["active", "maintenance", "inactive"]),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const facilityId = parseInt(id, 10);

  if (isNaN(facilityId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const facility = await prisma.facility.findUnique({ where: { id: facilityId } });
  if (!facility) {
    return NextResponse.json({ error: "Fasilitas tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json({ data: facility });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const facilityId = parseInt(id, 10);

  if (isNaN(facilityId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const body = await req.json();

  const facility = await prisma.facility.update({
    where: { id: facilityId },
    data: {
      name: body.name,
      type: body.type,
      location: body.location,
      capacity: body.capacity ?? null,
      description: body.description,
      imageUrl: body.image_url ?? null,
    },
  });

  return NextResponse.json({ data: facility });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const facilityId = parseInt(id, 10);

  if (isNaN(facilityId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = patchStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const existing = await prisma.facility.findUnique({ where: { id: facilityId } });
  if (!existing) {
    return NextResponse.json({ error: "Fasilitas tidak ditemukan" }, { status: 404 });
  }

  const facility = await prisma.facility.update({
    where: { id: facilityId },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ data: facility });
}
