import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";

export type AuthUser = {
  id: number;
  name?: string;
  email?: string;
  role: "admin" | "petugas" | "pengguna";
  status: "pending" | "verified" | "rejected";
};

export async function getSessionUser(): Promise<AuthUser | null> {
  const session = await getSession();
  if (session) {
    return {
      id: session.userId,
      role: session.role,
      status: session.status,
    };
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(token.value.split(".")[1], "base64").toString()
    );
    return {
      ...payload,
      id: payload.id ?? payload.userId,
    } as AuthUser;
  } catch {
    return null;
  }
}
