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

export default function Table<T>({
  columns,
  data,
  keyField,
  emptyMessage = "Tidak ada data",
}: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto rounded-md border border-warm-mist">
      <table className="w-full border-collapse text-caption font-ibm-plex-sans-variable">
        <thead>
          <tr className="border-b border-warm-mist bg-soft-linen">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-4 py-3 text-center font-medium text-olive-char",
                  col.className
                )}
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
                className="px-4 py-8 text-center text-sage-gray"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={String(row[keyField])}
                className="border-b border-warm-mist last:border-b-0 hover:bg-pale-stone transition-colors duration-150"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-4 py-3 text-center text-deep-moss", col.className)}
                  >
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? "")}
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
