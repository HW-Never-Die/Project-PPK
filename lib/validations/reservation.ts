import { z } from "zod/v4";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

const isMultipleOf30 = (time: string) => {
  const [, m] = time.split(":").map(Number);
  return m === 0 || m === 30;
};

const isInOperatingHours = (time: string, isEnd = false) => {
  const [h, m] = time.split(":").map(Number);
  const mins = h * 60 + m;
  if (isEnd) return mins >= 7 * 60 + 30 && mins <= 20 * 60;
  return mins >= 7 * 60 && mins <= 19 * 60 + 30;
};

export const createReservationSchema = z
  .object({
    facilityId: z.number().int().positive(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
    startTime: z
      .string()
      .regex(timeRegex, "Format waktu harus HH:MM")
      .refine(isMultipleOf30, "Waktu harus kelipatan 30 menit")
      .refine((t) => isInOperatingHours(t), "Waktu di luar jam operasional (07:00-20:00)"),
    endTime: z
      .string()
      .regex(timeRegex, "Format waktu harus HH:MM")
      .refine(isMultipleOf30, "Waktu harus kelipatan 30 menit")
      .refine((t) => isInOperatingHours(t, true), "Waktu di luar jam operasional (07:00-20:00)"),
    purpose: z.string().min(10, "Tujuan penggunaan minimal 10 karakter").max(1000),
  })
  .refine(
    (data) => {
      const [sh, sm] = data.startTime.split(":").map(Number);
      const [eh, em] = data.endTime.split(":").map(Number);
      return sh * 60 + sm < eh * 60 + em;
    },
    { message: "Waktu mulai harus lebih awal dari waktu selesai", path: ["endTime"] }
  )
  .refine(
    (data) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(data.date + "T00:00:00");
      return selected >= today;
    },
    { message: "Tanggal tidak boleh di masa lalu", path: ["date"] }
  );

export const updateReservationSchema = z.object({
  action: z.enum(["approve", "reject", "cancel"]),
  cancelReason: z.string().min(5, "Alasan pembatalan minimal 5 karakter").optional(),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type UpdateReservationInput = z.infer<typeof updateReservationSchema>;
