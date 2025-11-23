import { Column } from "@/types/table";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  breakpointClass: string;
  baseIndex?: number;
}

export default function TableDesktop<T>({
  data,
  columns,
  breakpointClass,
  baseIndex = 1,
}: Props<T>) {
  return (
    <div className={`overflow-x-auto ${breakpointClass}`}>
      <div className="min-w-[640px]">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.header}
                  isHeader
                  className={`px-5 py-4 text-left text-sm font-medium tracking-wider text-gray-800 uppercase ${col.widthClass || ""}`}
                >
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow key={i} className="hover:bg-gray-50">
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
                    <TableCell
                      key={col.header}
                      className={`border-b text-sm border-gray-200 px-5 py-3 text-gray-700 dark:border-white/10 dark:text-gray-300 ${
                        col.cellClassName || ""
                      }`}
                    >
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
