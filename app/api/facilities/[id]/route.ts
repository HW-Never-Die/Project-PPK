import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  updateFacilitySchema,
  patchFacilityStatusSchema,
} from "@/lib/validations/facility";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const facilityId = parseInt(id, 10);

  if (isNaN(facilityId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const facility = await prisma.facility.findUnique({
    where: { id: facilityId },
  });

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
  const parsed = updateFacilitySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const existing = await prisma.facility.findUnique({
    where: { id: facilityId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Fasilitas tidak ditemukan" }, { status: 404 });
  }

  const { name, type, location, capacity, description, status, imageUrl } = parsed.data;

  const facility = await prisma.facility.update({
    where: { id: facilityId },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(type !== undefined ? { type } : {}),
      ...(location !== undefined ? { location } : {}),
      ...(capacity !== undefined ? { capacity } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(imageUrl !== undefined ? { imageUrl } : {}),
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
  const parsed = patchFacilityStatusSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const existing = await prisma.facility.findUnique({
    where: { id: facilityId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Fasilitas tidak ditemukan" }, { status: 404 });
  }

  const facility = await prisma.facility.update({
    where: { id: facilityId },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ data: facility });
}
