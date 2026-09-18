import type { UserRole, UserStatus, FacilityType, FacilityStatus, ReservationStatus, ReportCategory, ReportStatus } from "@prisma/client";

export type { UserRole, UserStatus, FacilityType, FacilityStatus, ReservationStatus, ReportCategory, ReportStatus };

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type Facility = {
  id: number;
  name: string;
  type: FacilityType;
  location: string;
  capacity: number | null;
  description: string;
  status: FacilityStatus;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Reservation = {
  id: number;
  userId: number;
  facilityId: number;
  date: Date;
  startTime: Date;
  endTime: Date;
  purpose: string;
  status: ReservationStatus;
  cancelReason: string | null;
  processedBy: number | null;
  processedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
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
  photoUrl: string | null;
  status: ReportStatus;
  resolutionNotes: string | null;
  processedBy: number | null;
  processedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  facility?: Facility;
  processor?: User | null;
};

export type APIResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
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
