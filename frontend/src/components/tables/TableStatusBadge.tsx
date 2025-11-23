import { PurchaseRequest } from "@/types";

export function TableStatusBadge({ status }: { status: PurchaseRequest["status"] }) {
  const base = "inline-flex items-center rounded-full px-2.5 py-1.5 text-xs font-medium";
  switch (status) {
    case "DRAFT":
      return <span className={`${base} bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300`}>DRAFT</span>;
    case "PENDING":
      return <span className={`${base} bg-warning-100 text-warning-600 dark:bg-warning-600/15 dark:text-warning-500`}>PENDING</span>;
    case "COMPLETED":
      return <span className={`${base} bg-success-100 text-success-600 dark:bg-success-600/15 dark:text-success-500`}>COMPLETED</span>;
    default:
      return null;
  }
}