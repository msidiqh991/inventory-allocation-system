import Button from "@/components/ui/button/Button";

interface Props {
  error: string;
  onRetry?: () => void;
}

export default function TableError({ error, onRetry }: Props) {
  return (
    <div className="p-8 text-center">
      <p className="text-sm text-red-600 dark:text-red-500 mb-4">{error}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Retry
        </Button>
      )}
    </div>
  );
}