"use client";

import { MainTableProps } from "@/types/table";
import { 
  TableMobileCards, 
  TableDesktop, 
  TableEmpty, 
  TableError, 
  TableLoading, 
  TablePagination 
} from "@/components/tables";

export default function TableTemplate<T>({
  columns,
  data,
  loading,
  error,
  onRetry,
  emptyText,
  responsiveBreakpoint = "md",
  pagination,
  hidePaginationIfSinglePage = true,
  mobileCards = true,
  showCountInfo = true,
}: MainTableProps<T>) {
  if (loading) return <TableLoading />;
  if (error) return <TableError error={error} onRetry={onRetry} />;
  if (!data.length) return <TableEmpty text={emptyText} />;

  let displayedData = data;
  let totalPages = 1;
  let baseIndex = 1;

  if (pagination) {
    const { currentPage, pageSize } = pagination;
    totalPages = Math.max(1, Math.ceil(data.length / pageSize));
    const start = (currentPage - 1) * pageSize;
    baseIndex = start;
    displayedData = data.slice(start, start + pageSize);
  }

  const hiddenOnMobile = responsiveBreakpoint === "md" ? "hidden md:block" : "hidden lg:block";
  const shownOnMobile = responsiveBreakpoint === "md" ? "md:hidden" : "lg:hidden";
  const showPagination = pagination && (!hidePaginationIfSinglePage || totalPages > 1);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50">
      {mobileCards && (
        <TableMobileCards
          data={displayedData}
          columns={columns}
          breakpointClass={shownOnMobile}
          baseIndex={baseIndex}
        />
      )}
      <TableDesktop
        data={displayedData}
        columns={columns}
        breakpointClass={hiddenOnMobile}
        baseIndex={baseIndex}
      />

      {(showPagination || showCountInfo) && (
        <div className="flex items-center justify-between flex-wrap gap-4 px-5 py-4 border-t border-gray-200 dark:border-white/10">
          {showCountInfo && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Showing {displayedData.length} of {data.length} items
            </p>
          )}
          {showPagination && pagination && (
            <TablePagination
              currentPage={pagination.currentPage}
              totalPages={totalPages}
              onPageChange={pagination.onPageChange}
            />
          )}
        </div>
      )}
    </div>
  );
}