import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { TIME_SLOTS } from "@/lib/constants";

function parseTimeToMinutes(d: Date): number {
  // Prisma MySQL Time(0) can be represented with UTC or local
  // We check getUTCHours vs getHours
  const hours = d.getUTCHours();
  const minutes = d.getUTCMinutes();
  return hours * 60 + minutes;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const facilityId = parseInt(id, 10);

  if (isNaN(facilityId)) {
    return NextResponse.json({ error: "ID tidak valid" }, { status: 400 });
  }

  const { searchParams } = new URL(req.url);
  const dateStr = searchParams.get("date");

  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return NextResponse.json(
      { error: "Parameter date wajib disertakan dengan format YYYY-MM-DD" },
      { status: 400 }
    );
  }

  const facility = await prisma.facility.findUnique({
    where: { id: facilityId },
  });

  if (!facility) {
    return NextResponse.json({ error: "Fasilitas tidak ditemukan" }, { status: 404 });
  }

  // Parse start of date and end of date for query
  const targetDateStart = new Date(`${dateStr}T00:00:00.000Z`);
  const targetDateEnd = new Date(`${dateStr}T23:59:59.999Z`);

  const reservations = await prisma.reservation.findMany({
    where: {
      facilityId,
      status: { in: ["pending", "approved"] },
      date: {
        gte: targetDateStart,
        lte: targetDateEnd,
      },
    },
    select: {
      id: true,
      startTime: true,
      endTime: true,
    },
  });

  const isFacilityAvailable = facility.status === "active";

  const slots = TIME_SLOTS.map((slot) => {
    if (!isFacilityAvailable) {
      return {
        id: slot.id,
        time: slot.label,
        startTime: slot.startTime,
        endTime: slot.endTime,
        available: false,
      };
    }

    // Check collision with approved reservations
    const hasCollision = reservations.some((r) => {
      const resStart = parseTimeToMinutes(new Date(r.startTime));
      const resEnd = parseTimeToMinutes(new Date(r.endTime));
      return slot.startMinutes < resEnd && slot.endMinutes > resStart;
    });

    return {
      id: slot.id,
      time: slot.label,
      startTime: slot.startTime,
      endTime: slot.endTime,
      available: !hasCollision,
    };
  });

  return NextResponse.json({
    data: {
      facility: {
        id: facility.id,
        name: facility.name,
        type: facility.type,
        status: facility.status,
      },
      date: dateStr,
      slots,
    },
  });
}
