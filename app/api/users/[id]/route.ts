import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { updateUserStatusSchema } from "@/lib/validations/user";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: "ID user tidak valid" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const parsed = updateUserStatusSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path.join(".");
        if (!fieldErrors[field]) fieldErrors[field] = [];
        fieldErrors[field].push(issue.message);
      }
      return NextResponse.json(
        { success: false, error: "Validasi gagal", errors: fieldErrors },
        { status: 400 }
      );
    }

    const { status } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    if (existingUser.status !== "pending") {
      return NextResponse.json(
        { success: false, error: "Hanya akun berstatus pending yang bisa diubah" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
      },
    });

    return NextResponse.json({ success: true, data: updatedUser });
  } catch {
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return NextResponse.json(
        { success: false, error: "ID user tidak valid" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    if (existingUser.role === "admin") {
      return NextResponse.json(
        { success: false, error: "Akun Administrator tidak dapat dihapus" },
        { status: 403 }
      );
    }

    await prisma.$transaction(async (tx) => {
      // Unlink processor references
      await tx.reservation.updateMany({
        where: { processedBy: userId },
        data: { processedBy: null },
      });
      await tx.report.updateMany({
        where: { processedBy: userId },
        data: { processedBy: null },
      });
      // Delete user's own reservations and reports
      await tx.reservation.deleteMany({
        where: { userId },
      });
      await tx.report.deleteMany({
        where: { userId },
      });
      // Delete user record
      await tx.user.delete({
        where: { id: userId },
      });
    });

    return NextResponse.json({
      success: true,
      message: "User berhasil dihapus",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server saat menghapus user" },
      { status: 500 }
    );
  }
}
