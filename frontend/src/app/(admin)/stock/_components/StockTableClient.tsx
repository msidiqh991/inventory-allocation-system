'use client';

import { useState } from "react";
import TableTemplate from "@/components/tables/TableTemplate";
import { Column } from "@/types/table";
import { StockItem } from "@/types";

interface Props {
  initialData: StockItem[];
} 

export default function StockTableClient({ initialData }: Props) {
  const [page, setPage] = useState(1);

  const columns: Column<StockItem>[] = [
    { key: "product_name", header: "Product Name", widthClass: "w-1/3" },
    { key: "warehouse_name", header: "Warehouse Name", widthClass: "w-1/3" },
    {
      key: "quantity",
      header: "Current Quantity",
      render: (row) => (
        <span
          className={`font-semibold ${
            row.quantity === 0
              ? "text-red-600 dark:text-red-500"
              : "text-brand-600 dark:text-brand-400"
          }`}
        >
          {row.quantity}
        </span>
      ),
    },
  ];

  return (
    <TableTemplate
      columns={columns}
      data={initialData}
      loading={false}
      error={null}
      pagination={{
        currentPage: page,
        pageSize: 5,
        onPageChange: setPage,
      }}
    />
  );
}