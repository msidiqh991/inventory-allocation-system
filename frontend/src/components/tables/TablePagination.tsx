import React from "react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const TablePagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const handleChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const buildPages = (): (number | string)[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | string)[] = [];
    const windowSize = 3;
    let start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, start + windowSize - 1);
    if (end - start < windowSize - 1) start = Math.max(2, end - windowSize + 1);

    pages.push(1);
    if (start > 2) pages.push("…");
    for (let p = start; p <= end; p++) pages.push(p);
    if (end < totalPages - 1) pages.push("…");
    pages.push(totalPages);
    return pages;
  };

  const pages = buildPages();

  return (
    <nav className="flex items-center gap-2" aria-label="Pagination">
      <button
        onClick={() => handleChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        aria-label="Previous page"
      >
        Prev
      </button>
      <ul className="flex items-center gap-1">
        {pages.map((item, i) =>
          typeof item === "string" ? (
            <li
              key={`ellipsis-${i}`}
              className="h-9 w-9 flex items-center justify-center text-xs text-gray-400 dark:text-gray-600"
            >
              {item}
            </li>
          ) : (
            <li key={item}>
              <button
                onClick={() => handleChange(item)}
                aria-current={item === currentPage ? "page" : undefined}
                className={`h-9 w-9 rounded-lg text-sm font-medium flex items-center justify-center ${
                  item === currentPage
                    ? "bg-brand-500 text-white"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300"
                }`}
              >
                {item}
              </button>
            </li>
          )
        )}
      </ul>
      <button
        onClick={() => handleChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
};

export default TablePagination;