import { z } from "zod/v4";

export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter"),
  email: z
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(6, "Password minimal 6 karakter"),
  role: z.enum(["petugas", "pengguna"], {
    error: "Role harus petugas atau pengguna",
  }),
});

export const updateUserStatusSchema = z.object({
  status: z.enum(["verified", "rejected"], {
    error: "Status harus verified atau rejected",
  }),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;
