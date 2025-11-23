import { Column } from "@/types/table";

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  breakpointClass: string;
  baseIndex?: number;
}

export default function TableMobileCards<T>({
  data,
  columns,
  breakpointClass,
  baseIndex = 1,
}: Props<T>) {
  return (
    <div className={`space-y-4 p-5 ${breakpointClass}`}>
      {data.map((row, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          {columns.map((col) => {
            const globalIndex = baseIndex + i;
            const value = col.isIndex
              ? globalIndex + 1
              : col.render
                ? col.render(row, i, globalIndex)
                : col.key
                  ? (row[col.key] as React.ReactNode)
                  : null;
            return (
              <div
                key={col.header}
                className="flex justify-between py-2 text-sm"
              >
                <span className="font-medium text-gray-500">{col.header}</span>
                <span className="font-semibold text-gray-800 dark:text-gray-100">
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
