import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  createFacilitySchema,
  facilityTypeEnum,
  facilityStatusEnum,
} from "@/lib/validations/facility";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const typeParam = searchParams.get("type");
  const locationParam = searchParams.get("location");
  const capacityParam = searchParams.get("capacity");
  const statusParam = searchParams.get("status");
  const searchParam = searchParams.get("search");
  const sortParam = searchParams.get("sort");

  const parsedType = facilityTypeEnum.safeParse(typeParam);
  const parsedStatus = facilityStatusEnum.safeParse(statusParam);

  let orderBy: Record<string, "asc" | "desc"> = { name: "asc" };
  if (sortParam === "name_desc") {
    orderBy = { name: "desc" };
  } else if (sortParam === "capacity_desc") {
    orderBy = { capacity: "desc" };
  } else if (sortParam === "capacity_asc") {
    orderBy = { capacity: "asc" };
  } else if (sortParam === "newest") {
    orderBy = { createdAt: "desc" };
  } else if (sortParam === "name_asc") {
    orderBy = { name: "asc" };
  }

  const facilities = await prisma.facility.findMany({
    where: {
      ...(parsedType.success ? { type: parsedType.data } : {}),
      ...(parsedStatus.success ? { status: parsedStatus.data } : {}),
      ...(locationParam ? { location: { contains: locationParam } } : {}),
      ...(capacityParam && !isNaN(parseInt(capacityParam, 10))
        ? { capacity: { gte: parseInt(capacityParam, 10) } }
        : {}),
      ...(searchParam
        ? {
            OR: [
              { name: { contains: searchParam } },
              { location: { contains: searchParam } },
              { description: { contains: searchParam } },
            ],
          }
        : {}),
    },
    orderBy,
  });

  return NextResponse.json({ data: facilities });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createFacilitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validasi gagal", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, type, location, capacity, description, status, imageUrl } = parsed.data;

    const facility = await prisma.facility.create({
      data: {
        name,
        type,
        location,
        capacity: capacity ?? null,
        description,
        status: status ?? "active",
        imageUrl: imageUrl ?? null,
      },
    });

    return NextResponse.json({ data: facility }, { status: 201 });
  } catch (error) {
    console.error("Gagal membuat fasilitas:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}
