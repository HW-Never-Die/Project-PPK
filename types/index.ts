export type UserRole = "admin" | "petugas" | "pengguna";
export type UserStatus = "pending" | "verified" | "rejected";

export type FacilityType =
  | "ruang_kelas"
  | "aula"
  | "laboratorium"
  | "alat"
  | "lapangan";

export type FacilityStatus = "active" | "maintenance" | "inactive";

export type ReservationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

export type ReportCategory =
  | "kerusakan"
  | "kebersihan"
  | "keamanan"
  | "lainnya";

export type ReportStatus = "new" | "in_progress" | "resolved" | "rejected";

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type Facility = {
  id: number;
  name: string;
  type: FacilityType;
  location: string;
  capacity?: number | null;
  description: string;
  status: FacilityStatus;
  imageUrl?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type Reservation = {
  id: number;
  userId: number;
  facilityId: number;
  date: Date | string;
  startTime: Date | string;
  endTime: Date | string;
  purpose: string;
  status: ReservationStatus;
  cancelReason?: string | null;
  processedBy?: number | null;
  processedAt?: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  user?: User;
  facility?: Facility;
  processor?: User | null;
};

export type Report = {
  id: number;
  userId: number;
  facilityId: number;
  category: ReportCategory;
  description: string;
  photoUrl?: string | null;
  status: ReportStatus;
  resolutionNotes?: string | null;
  processedBy?: number | null;
  processedAt?: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  user?: User;
  facility?: Facility;
  processor?: User | null;
};

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

export type APIResponse<T = unknown> = {
  success?: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  details?: Record<string, string[]>;
};

export type JWTPayload = {
  userId: number;
  role: UserRole;
  status: UserStatus;
};

export type NavItem = {
  label: string;
  href: string;
  icon: string;
};
