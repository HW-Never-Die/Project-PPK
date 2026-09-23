import { cookies } from "next/headers";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "petugas" | "pengguna";
  status: "pending" | "verified" | "rejected";
};

// ponytail: mock auth — replace with real JWT decode from lib/auth.ts when Zaidan merges
export async function getSessionUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(token.value.split(".")[1], "base64").toString()
    );
    return payload as AuthUser;
  } catch {
    return null;
  }
}
