export interface Column<T> {
    key?: keyof T;
    header: string;
    widthClass?: string;
    render?: (row: T, rowIndex: number, globalIndex: number) => React.ReactNode;
    headerClassName?: string;
    cellClassName?: string;
    isIndex?: boolean;
}

export interface TableStateProps {
    loading?: boolean;
    error?: string | null;
    onRetry?: () => void;
}

export interface TablePaginationProps {
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export interface MainTableProps<T> extends TableStateProps {
  columns: Column<T>[];
  data: T[];
  emptyText?: string;
  responsiveBreakpoint?: "md" | "lg";
  pagination?: TablePaginationProps;
  hidePaginationIfSinglePage?: boolean;
  mobileCards?: boolean;
  showCountInfo?: boolean;
}