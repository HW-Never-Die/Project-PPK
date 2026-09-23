import { NextResponse } from "next/server";
import { deleteSessionCookie } from "@/lib/auth";

export async function POST() {
  const cookie = deleteSessionCookie();
  const response = NextResponse.json({ success: true });
  response.cookies.set(cookie);
  return response;
}

export async function GET(request: Request) {
  const cookie = deleteSessionCookie();
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set(cookie);
  return response;
}
