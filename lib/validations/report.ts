import { z } from "zod";

export const createReportSchema = z.object({
  facility_id: z.number().int().positive(),
  category: z.enum(["kerusakan", "kebersihan", "keamanan", "lainnya"]),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  photo_url: z.string().url().optional().nullable(),
});

export const updateReportSchema = z.object({
  status: z.enum(["new", "in_progress", "resolved", "rejected"]),
  resolution_notes: z.string().optional().nullable(),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
export type UpdateReportInput = z.infer<typeof updateReportSchema>;
