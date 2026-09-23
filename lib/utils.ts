export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDateIndo(dateInput: string | Date): string {
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatTimeSlot(start: string, end: string): string {
  return `${start} - ${end}`;
}

export function formatFacilityType(type: string): string {
  switch (type) {
    case "ruang_kelas":
      return "Ruang Kelas";
    case "aula":
      return "Aula";
    case "laboratorium":
      return "Laboratorium";
    case "alat":
      return "Alat / Elektronik";
    case "lapangan":
      return "Lapangan Olahraga";
    default:
      return type;
  }
}

export function formatFacilityStatus(status: string): {
  label: string;
  variant: "success" | "warning" | "danger" | "neutral";
} {
  switch (status) {
    case "active":
      return { label: "Tersedia", variant: "success" };
    case "maintenance":
      return { label: "Perbaikan", variant: "warning" };
    case "inactive":
      return { label: "Nonaktif", variant: "danger" };
    default:
      return { label: status, variant: "neutral" };
  }
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

export function timeStringToDate(time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const d = new Date(1970, 0, 1, hours, minutes, 0, 0);
  return d;
}

export function dateToTimeString(date: Date): string {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}
