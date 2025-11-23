interface Props {
  text?: string;
}

export default function TableEmpty({ text = "No data available, Check your connection!" }: Props) {
  return (
    <div className="p-8 text-center">
      <p className="text-md text-gray-500 dark:text-gray-400">{text}</p>
    </div>
  );
}