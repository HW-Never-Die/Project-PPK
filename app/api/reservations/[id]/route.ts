import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { updateReservationSchema } from "@/lib/validations/reservation";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const reservationId = Number(id);
  if (isNaN(reservationId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      facility: { select: { id: true, name: true, type: true, location: true } },
      processor: { select: { id: true, name: true } },
    },
  });

  if (!reservation) {
    return NextResponse.json({ error: "Reservasi tidak ditemukan" }, { status: 404 });
  }

  if (
    session.role === "pengguna" &&
    reservation.userId !== session.userId
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ data: reservation });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const reservationId = Number(id);
  if (isNaN(reservationId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const body = await request.json();
  const parsed = updateReservationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { action, cancelReason } = parsed.data;

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { facility: true },
  });

  if (!reservation) {
    return NextResponse.json({ error: "Reservasi tidak ditemukan" }, { status: 404 });
  }

  // === APPROVE (Petugas/Admin) ===
  if (action === "approve") {
    if (session.role !== "petugas" && session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (reservation.status !== "pending") {
      return NextResponse.json(
        { error: "Hanya reservasi pending yang dapat disetujui" },
        { status: 400 }
      );
    }

    // ALGORITMA SERVER ANTI-BENTROK
    // Cari reservasi lain yang sudah approved pada fasilitas & tanggal sama
    // dengan rentang waktu yang overlap (startTime < existingEndTime && endTime > existingStartTime)
    const conflicting = await prisma.reservation.findFirst({
      where: {
        id: { not: reservationId },
        facilityId: reservation.facilityId,
        date: reservation.date,
        status: "approved",
        startTime: { lt: reservation.endTime },
        endTime: { gt: reservation.startTime },
      },
    });

    if (conflicting) {
      const fmt = (d: Date) => {
        const h = String(d.getUTCHours()).padStart(2, "0");
        const m = String(d.getUTCMinutes()).padStart(2, "0");
        return `${h}:${m}`;
      };
      return NextResponse.json(
        {
          error: "Jadwal bentrok dengan reservasi lain yang sudah disetujui",
          conflict: {
            id: conflicting.id,
            startTime: fmt(conflicting.startTime),
            endTime: fmt(conflicting.endTime),
          },
        },
        { status: 409 }
      );
    }

    const updated = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status: "approved",
        processedBy: session.userId,
        processedAt: new Date(),
      },
    });

    return NextResponse.json({ data: updated });
  }

  // === REJECT (Petugas/Admin) ===
  if (action === "reject") {
    if (session.role !== "petugas" && session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (reservation.status !== "pending") {
      return NextResponse.json(
        { error: "Hanya reservasi pending yang dapat ditolak" },
        { status: 400 }
      );
    }

    const updated = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status: "rejected",
        processedBy: session.userId,
        processedAt: new Date(),
      },
    });

    return NextResponse.json({ data: updated });
  }

  // === CANCEL (Pengguna sendiri atau Petugas darurat) ===
  if (action === "cancel") {
    if (session.role === "petugas" || session.role === "admin") {
      // Petugas: cancel darurat, wajib cancel_reason
      if (!cancelReason) {
        return NextResponse.json(
          { error: "Alasan pembatalan wajib diisi untuk pembatalan oleh petugas" },
          { status: 400 }
        );
      }
      if (reservation.status !== "approved") {
        return NextResponse.json(
          { error: "Petugas hanya dapat membatalkan reservasi yang sudah disetujui" },
          { status: 400 }
        );
      }

      const updated = await prisma.reservation.update({
        where: { id: reservationId },
        data: {
          status: "cancelled",
          cancelReason,
          processedBy: session.userId,
          processedAt: new Date(),
        },
      });

      return NextResponse.json({ data: updated });
    }

    // Pengguna: cancel milik sendiri
    if (reservation.userId !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (reservation.status !== "pending" && reservation.status !== "approved") {
      return NextResponse.json(
        { error: "Reservasi ini tidak dapat dibatalkan" },
        { status: 400 }
      );
    }

    const now = new Date();
    const nowWIB = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const resDateStr = reservation.date.toISOString().split("T")[0]!;
    const resH = reservation.startTime.getUTCHours();
    const resM = reservation.startTime.getUTCMinutes();
    const reservationWIB = new Date(`${resDateStr}T${String(resH).padStart(2, "0")}:${String(resM).padStart(2, "0")}:00.000Z`);
    if (reservationWIB <= nowWIB) {
      return NextResponse.json(
        { error: "Tidak dapat membatalkan reservasi yang waktunya sudah lewat" },
        { status: 400 }
      );
    }

    const updated = await prisma.reservation.update({
      where: { id: reservationId },
      data: {
        status: "cancelled",
        cancelReason: cancelReason || "Dibatalkan oleh pengguna",
      },
    });

    return NextResponse.json({ data: updated });
  }

  return NextResponse.json({ error: "Aksi tidak valid" }, { status: 400 });
}
