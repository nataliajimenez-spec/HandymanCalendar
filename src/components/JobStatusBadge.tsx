const STYLES: Record<string, string> = {
  SCHEDULED: "bg-orange-100 text-orange-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-gray-200 text-gray-500 line-through",
};

const LABELS: Record<string, string> = {
  SCHEDULED: "Agendado",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
};

export function JobStatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STYLES[status] ?? ""}`}>
      {LABELS[status] ?? status}
    </span>
  );
}
