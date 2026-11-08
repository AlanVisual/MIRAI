import type { TicketStatus } from "@/types/ticket";

const styles: Record<TicketStatus, { label: string; className: string }> = {
  PENDIENTE: {
    label: "Pendiente",
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  },
  EN_PROCESO: {
    label: "En proceso",
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300",
  },
  RESUELTO: {
    label: "Resuelto",
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  CANCELADO: {
    label: "Cancelado",
    className:
      "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  },
};

export function StatusBadge({ status }: { status: TicketStatus }) {
  const { label, className } = styles[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
