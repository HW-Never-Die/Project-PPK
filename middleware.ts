import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";
import type { JWTPayload } from "@/types";

const COOKIE_NAME = "eunomia_session";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is not set");
  return new TextEncoder().encode(secret);
}

async function getTokenPayload(
  request: NextRequest
): Promise<JWTPayload | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

const protectedRoutes: { prefix: string; roles: string[] }[] = [
  { prefix: "/pengguna", roles: ["pengguna"] },
  { prefix: "/petugas", roles: ["petugas"] },
  { prefix: "/admin", roles: ["admin"] },
  { prefix: "/api/users", roles: ["admin"] },
];

const publicOnlyRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const user = await getTokenPayload(request);

  for (const route of publicOnlyRoutes) {
    if (pathname.startsWith(route) && user) {
      const defaultRoute =
        user.role === "admin"
          ? "/admin"
          : user.role === "petugas"
            ? "/petugas"
            : "/pengguna";
      return NextResponse.redirect(new URL(defaultRoute, request.url));
    }
  }

  for (const route of protectedRoutes) {
    if (pathname.startsWith(route.prefix)) {
      if (!user) {
        return NextResponse.redirect(new URL("/login", request.url));
      }

      if (user.status !== "verified") {
        const response = NextResponse.redirect(
          new URL("/login", request.url)
        );
        response.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
        return response;
      }

      if (!route.roles.includes(user.role)) {
        const defaultRoute =
          user.role === "admin"
            ? "/admin"
            : user.role === "petugas"
              ? "/petugas"
              : "/pengguna";
        return NextResponse.redirect(new URL(defaultRoute, request.url));
      }
    }
  }

  const requestHeaders = new Headers(request.headers);
  if (user) {
    requestHeaders.set("x-user-id", String(user.userId));
    requestHeaders.set("x-user-role", user.role);
    requestHeaders.set("x-user-status", user.status);
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: [
    "/pengguna/:path*",
    "/petugas/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/api/users/:path*",
  ],
};
