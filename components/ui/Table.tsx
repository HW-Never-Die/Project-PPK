import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Column<T> = {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
};

type TableProps<T> = {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  emptyMessage?: string;
};

/**
 * DESIGN.md §4.9 — Data Row / List Card patterns applied to table.
 * Border: #e5e7e0 (border-default), separator #eeefe9
 * Row hover: borderColor #bfc1b7, shadow 0 3px 10px rgba(0,0,0,0.04)
 * Font: IBM Plex Sans, 13px
 */
export default function Table<T>({
  columns,
  data,
  keyField,
  emptyMessage = "Tidak ada data",
}: TableProps<T>) {
  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        borderRadius: "8px",
        border: "1px solid #e5e7e0",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "13px",
          fontFamily: "'IBM Plex Sans Variable', sans-serif",
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: "1px solid #e5e7e0",
              backgroundColor: "#fdfdf8",
            }}
          >
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn("px-4 py-3 text-center", col.className)}
                style={{
                  fontWeight: 600,
                  color: "#65675e",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.3px",
                  fontFamily: "'IBM Plex Sans Variable', sans-serif",
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  padding: "48px 24px",
                  textAlign: "center",
                  color: "#65675e",
                  fontSize: "13px",
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={String(row[keyField])}
                style={{
                  borderBottom: "1px solid #eeefe9",
                  transition: "all 0.15s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#fdfdf8";
                  e.currentTarget.style.boxShadow =
                    "0 3px 10px rgba(0,0,0,0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-4 py-3 text-center", col.className)}
                    style={{ color: "#23251d" }}
                  >
                    {col.render
                      ? col.render(row)
                      : String(
                          (row as Record<string, unknown>)[col.key] ?? ""
                        )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
