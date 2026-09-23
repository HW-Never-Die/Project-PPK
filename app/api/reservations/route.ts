import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth-mock";
import { createReservationSchema } from "@/lib/validations/reservation";

function timeStringToDate(time: string): Date {
  const [h, m] = time.split(":").map(Number);
  return new Date(1970, 0, 1, h, m, 0);
}

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "petugas" && user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const facilityId = searchParams.get("facilityId");

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (facilityId) where.facilityId = Number(facilityId);

  const reservations = await prisma.reservation.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true } },
      facility: { select: { id: true, name: true, type: true, location: true } },
      processor: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: reservations });
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (user.role !== "pengguna") {
    return NextResponse.json(
      { error: "Hanya pengguna yang dapat mengajukan reservasi" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const parsed = createReservationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { facilityId, date, startTime, endTime, purpose } = parsed.data;

  const facility = await prisma.facility.findUnique({ where: { id: facilityId } });
  if (!facility) {
    return NextResponse.json({ error: "Fasilitas tidak ditemukan" }, { status: 404 });
  }
  if (facility.status !== "active") {
    return NextResponse.json(
      { error: "Fasilitas tidak tersedia untuk reservasi" },
      { status: 400 }
    );
  }

  const reservation = await prisma.reservation.create({
    data: {
      userId: user.id,
      facilityId,
      date: new Date(date + "T00:00:00"),
      startTime: timeStringToDate(startTime),
      endTime: timeStringToDate(endTime),
      purpose,
      status: "pending",
    },
    include: {
      facility: { select: { id: true, name: true, type: true, location: true } },
    },
  });

  return NextResponse.json({ data: reservation }, { status: 201 });
}
