const TableLoading = () => {
  return (
    <div className="p-8 text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand-500 border-r-transparent" />
      <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
    </div>
  );
}

export default TableLoading;