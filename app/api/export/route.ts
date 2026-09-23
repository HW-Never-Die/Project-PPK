import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import Papa from "papaparse";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const runtime = "nodejs";

type ReportType = "occupancy" | "damage";
type ExportFormat = "csv" | "excel" | "pdf";

type OccupancyRow = {
  Tanggal: string;
  Fasilitas: string;
  Tipe: string;
  Lokasi: string;
  "Waktu Mulai": string;
  "Waktu Selesai": string;
  Pemohon: string;
  Status: string;
};

type DamageRow = {
  Tanggal: string;
  Fasilitas: string;
  Lokasi: string;
  Kategori: string;
  Deskripsi: string;
  Status: string;
  Pelapor: string;
  "Ditangani Oleh": string;
  "Catatan Resolusi": string;
};

type DataRow = OccupancyRow | DamageRow;

type ReservationWithRelations = {
  date: Date;
  startTime: Date;
  endTime: Date;
  status: string;
  facility: { name: string; type: string; location: string };
  user: { name: string };
};

type ReportWithRelations = {
  createdAt: Date;
  category: string;
  description: string;
  status: string;
  resolutionNotes: string | null;
  facility: { name: string; location: string };
  user: { name: string };
  processor: { name: string } | null;
};

async function getOccupancyData(from: Date, to: Date): Promise<OccupancyRow[]> {
  const reservations = (await prisma.reservation.findMany({
    where: {
      date: { gte: from, lte: to },
      status: "approved",
    },
    include: {
      facility: { select: { name: true, type: true, location: true } },
      user: { select: { name: true } },
    },
    orderBy: { date: "asc" },
  })) as ReservationWithRelations[];

  return reservations.map((r) => ({
    Tanggal: r.date.toISOString().split("T")[0] ?? "",
    Fasilitas: r.facility.name,
    Tipe: r.facility.type,
    Lokasi: r.facility.location,
    "Waktu Mulai": r.startTime.toISOString().split("T")[1]?.slice(0, 5) ?? "",
    "Waktu Selesai": r.endTime.toISOString().split("T")[1]?.slice(0, 5) ?? "",
    Pemohon: r.user.name,
    Status: r.status,
  }));
}

async function getDamageData(from: Date, to: Date): Promise<DamageRow[]> {
  const reports = (await prisma.report.findMany({
    where: {
      createdAt: { gte: from, lte: to },
    },
    include: {
      facility: { select: { name: true, location: true } },
      user: { select: { name: true } },
      processor: { select: { name: true } },
    },
    orderBy: { createdAt: "asc" },
  })) as ReportWithRelations[];

  return reports.map((r) => ({
    Tanggal: r.createdAt.toISOString().split("T")[0] ?? "",
    Fasilitas: r.facility.name,
    Lokasi: r.facility.location,
    Kategori: r.category,
    Deskripsi: r.description,
    Status: r.status,
    Pelapor: r.user.name,
    "Ditangani Oleh": r.processor?.name ?? "-",
    "Catatan Resolusi": r.resolutionNotes ?? "-",
  }));
}

function toCSV(rows: DataRow[]): string {
  return Papa.unparse(rows);
}

async function toExcel(
  rows: DataRow[],
  sheetName: string
): Promise<ArrayBuffer> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet(sheetName);

  if (rows.length === 0) {
    ws.addRow(["Tidak ada data"]);
    return wb.xlsx.writeBuffer();
  }

  const headers = Object.keys(rows[0]);
  ws.addRow(headers);

  ws.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFEB9D2A" },
    };
    cell.border = {
      bottom: { style: "thin" },
    };
  });

  rows.forEach((row) => ws.addRow(Object.values(row)));

  ws.columns.forEach((col) => {
    col.width = 20;
  });

  return wb.xlsx.writeBuffer();
}

function toPDF(
  rows: DataRow[],
  title: string
): ArrayBuffer {
  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(14);
  doc.setTextColor(35, 37, 29);
  doc.text(title, 14, 16);

  if (rows.length === 0) {
    doc.setFontSize(11);
    doc.text("Tidak ada data", 14, 30);
    return doc.output("arraybuffer");
  }

  const headers = Object.keys(rows[0]);
  const body = rows.map((r) => Object.values(r));

  autoTable(doc, {
    head: [headers],
    body,
    startY: 22,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: {
      fillColor: [235, 157, 42],
      textColor: [35, 37, 29],
      fontStyle: "bold",
    },
  });

  return doc.output("arraybuffer");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const format = (searchParams.get("format") ?? "csv") as ExportFormat;
  const reportType = (searchParams.get("report") ?? "occupancy") as ReportType;
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  if (!["csv", "excel", "pdf"].includes(format)) {
    return NextResponse.json({ error: "Format tidak valid. Gunakan: csv, excel, pdf" }, { status: 400 });
  }

  if (!["occupancy", "damage"].includes(reportType)) {
    return NextResponse.json({ error: "Tipe rekap tidak valid. Gunakan: occupancy, damage" }, { status: 400 });
  }

  const from = fromParam ? new Date(fromParam) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const to = toParam ? new Date(toParam) : new Date();

  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    return NextResponse.json({ error: "Format tanggal tidak valid. Gunakan YYYY-MM-DD" }, { status: 400 });
  }

  to.setHours(23, 59, 59, 999);

  const rows: DataRow[] =
    reportType === "occupancy"
      ? await getOccupancyData(from, to)
      : await getDamageData(from, to);

  const title =
    reportType === "occupancy"
      ? `Rekap Okupansi Fasilitas (${from.toLocaleDateString("id-ID")} - ${to.toLocaleDateString("id-ID")})`
      : `Rekap Kerusakan Fasilitas (${from.toLocaleDateString("id-ID")} - ${to.toLocaleDateString("id-ID")})`;

  const filename = `rekap-${reportType}-${Date.now()}`;

  if (format === "csv") {
    const csv = toCSV(rows);
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}.csv"`,
      },
    });
  }

  if (format === "excel") {
    const buffer = await toExcel(rows, reportType === "occupancy" ? "Okupansi" : "Kerusakan");
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}.xlsx"`,
      },
    });
  }

  const buffer = toPDF(rows, title);
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}.pdf"`,
    },
  });
}
