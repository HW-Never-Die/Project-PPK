export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
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

export function formatFacilityStatus(status: string): { label: string; variant: "success" | "warning" | "danger" | "neutral" } {
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
