import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { createReservationSchema } from "@/lib/validations/reservation";

function timeStringToDate(time: string): Date {
  const [h, m] = time.split(":").map(Number);
  return new Date(Date.UTC(1970, 0, 1, h, m, 0));
}

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "petugas" && session.role !== "admin") {
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
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "pengguna") {
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

  const pendingCount = await prisma.reservation.count({
    where: { userId: session.userId, status: "pending" },
  });
  if (pendingCount >= 3) {
    return NextResponse.json(
      { error: "Anda sudah memiliki 3 pengajuan reservasi yang masih menunggu. Harap tunggu hingga salah satu diproses." },
      { status: 400 }
    );
  }

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

  const startDt = timeStringToDate(startTime);
  const endDt = timeStringToDate(endTime);
  const dateDt = new Date(date + "T00:00:00.000Z");

  const conflicting = await prisma.reservation.findFirst({
    where: {
      facilityId,
      date: dateDt,
      status: "approved",
      startTime: { lt: endDt },
      endTime: { gt: startDt },
    },
  });

  if (conflicting) {
    return NextResponse.json(
      { error: "Slot waktu yang dipilih sudah dipesan oleh pengguna lain" },
      { status: 409 }
    );
  }

  const reservation = await prisma.reservation.create({
    data: {
      userId: session.userId,
      facilityId,
      date: dateDt,
      startTime: startDt,
      endTime: endDt,
      purpose,
      status: "pending",
    },
    include: {
      facility: { select: { id: true, name: true, type: true, location: true } },
    },
  });

  return NextResponse.json({ data: reservation }, { status: 201 });
}
