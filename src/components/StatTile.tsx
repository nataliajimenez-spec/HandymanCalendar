export function StatTile({
  label,
  value,
  dotClassName,
}: {
  label: string;
  value: number;
  dotClassName?: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-1.5 text-sm text-gray-500">
        {dotClassName && <span className={`h-2 w-2 rounded-full ${dotClassName}`} />}
        {label}
      </div>
      <div className="mt-1 text-3xl font-semibold text-gray-900">{value}</div>
    </div>
  );
}
