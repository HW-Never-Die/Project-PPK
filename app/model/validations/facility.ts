import { z } from "zod";

export const facilityTypeEnum = z.enum([
  "ruang_kelas",
  "aula",
  "laboratorium",
  "alat",
  "lapangan",
]);

export const facilityStatusEnum = z.enum(["active", "maintenance", "inactive"]);

export const createFacilitySchema = z.object({
  name: z.string().min(1, "Nama fasilitas wajib diisi").max(100),
  type: facilityTypeEnum,
  location: z.string().min(1, "Lokasi wajib diisi").max(200),
  capacity: z.number().int().positive("Kapasitas harus berupa angka positif").nullable().optional(),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  status: facilityStatusEnum.optional().default("active"),
  imageUrl: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
}).transform((data) => ({
  ...data,
  imageUrl: data.imageUrl ?? data.image_url ?? null,
}));

export const updateFacilitySchema = z.object({
  name: z.string().min(1, "Nama fasilitas wajib diisi").max(100).optional(),
  type: facilityTypeEnum.optional(),
  location: z.string().min(1, "Lokasi wajib diisi").max(200).optional(),
  capacity: z.number().int().positive("Kapasitas harus berupa angka positif").nullable().optional(),
  description: z.string().min(1, "Deskripsi wajib diisi").optional(),
  status: facilityStatusEnum.optional(),
  imageUrl: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
}).transform((data) => ({
  ...data,
  imageUrl: data.imageUrl !== undefined ? data.imageUrl : data.image_url !== undefined ? data.image_url : undefined,
}));

export const patchFacilityStatusSchema = z.object({
  status: facilityStatusEnum,
});

export type CreateFacilityInput = z.infer<typeof createFacilitySchema>;
export type UpdateFacilityInput = z.infer<typeof updateFacilitySchema>;
export type PatchFacilityStatusInput = z.infer<typeof patchFacilityStatusSchema>;
