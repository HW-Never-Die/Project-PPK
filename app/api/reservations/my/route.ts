import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/auth-mock";

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");

  const where: Record<string, unknown> = { userId: user.id };
  if (status) where.status = status;

  const reservations = await prisma.reservation.findMany({
    where,
    include: {
      facility: { select: { id: true, name: true, type: true, location: true } },
      processor: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: reservations });
}
