export type UserRole = "admin" | "petugas" | "pengguna";
export type UserStatus = "pending" | "verified" | "rejected";

export type FacilityType =
  | "ruang_kelas"
  | "aula"
  | "laboratorium"
  | "alat"
  | "lapangan";

export type FacilityStatus = "active" | "maintenance" | "inactive";

export type ReservationStatus = "pending" | "approved" | "rejected" | "cancelled";

export type ReportCategory =
  | "kerusakan"
  | "kebersihan"
  | "keamanan"
  | "lainnya";

export type ReportStatus = "new" | "in_progress" | "resolved" | "rejected";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Facility {
  id: number;
  name: string;
  type: FacilityType;
  location: string;
  capacity?: number | null;
  description: string;
  status: FacilityStatus;
  imageUrl?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Reservation {
  id: number;
  userId: number;
  facilityId: number;
  date: string | Date;
  startTime: string | Date;
  endTime: string | Date;
  purpose: string;
  status: ReservationStatus;
  cancelReason?: string | null;
  processedBy?: number | null;
  processedAt?: string | Date | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  facility?: Facility;
  user?: User;
}

export interface Report {
  id: number;
  userId: number;
  facilityId: number;
  category: ReportCategory;
  description: string;
  photoUrl?: string | null;
  status: ReportStatus;
  resolutionNotes?: string | null;
  processedBy?: number | null;
  processedAt?: string | Date | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  facility?: Facility;
  user?: User;
}

export interface SlotAvailability {
  id: string;
  time: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface FacilityAvailabilityResponse {
  facility: {
    id: number;
    name: string;
    type: FacilityType;
    status: FacilityStatus;
  };
  date: string;
  slots: SlotAvailability[];
}

export interface APIResponse<T> {
  data?: T;
  error?: string;
  details?: Record<string, string[]>;
}
