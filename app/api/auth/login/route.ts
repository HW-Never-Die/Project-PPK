import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, signToken, createSessionCookie } from "@/lib/auth";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

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

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Email atau password salah" },
        { status: 401 }
      );
    }

    const passwordValid = await verifyPassword(password, user.password);
    if (!passwordValid) {
      return NextResponse.json(
        { success: false, error: "Email atau password salah" },
        { status: 401 }
      );
    }

    if (user.status === "pending") {
      return NextResponse.json(
        { success: false, error: "Akun belum diverifikasi oleh admin" },
        { status: 403 }
      );
    }

    if (user.status === "rejected") {
      return NextResponse.json(
        { success: false, error: "Akun ditolak oleh admin" },
        { status: 403 }
      );
    }

    const token = await signToken({
      userId: user.id,
      role: user.role,
      status: user.status,
    });

    const cookie = createSessionCookie(token);
    const response = NextResponse.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });

    response.cookies.set(cookie);
    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
