import type { TicketStatsData } from "@/types/ticket";

const cardClassName =
  "rounded-2xl border border-black/[.08] bg-white p-5 dark:border-white/[.145] dark:bg-zinc-950";

export function TicketStats({
  total,
  pending,
  inProgress,
  resolved,
  topBuilding,
}: TicketStatsData) {
  const cards = [
    {
      label: "Total reportados",
      value: total,
      dotClassName: "bg-zinc-400",
      valueClassName: "text-foreground",
    },
    {
      label: "Pendientes",
      value: pending,
      dotClassName: "bg-amber-500",
      valueClassName: "text-amber-600 dark:text-amber-400",
    },
    {
      label: "En proceso",
      value: inProgress,
      dotClassName: "bg-blue-500",
      valueClassName: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Resueltos",
      value: resolved,
      dotClassName: "bg-emerald-500",
      valueClassName: "text-emerald-600 dark:text-emerald-400",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <div key={card.label} className={cardClassName}>
          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <span className={`h-2.5 w-2.5 rounded-full ${card.dotClassName}`} />
            {card.label}
          </div>
          <p className={`mt-2 text-3xl font-semibold ${card.valueClassName}`}>
            {card.value}
          </p>
        </div>
      ))}

      <div className={cardClassName}>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Edificio más afectado
        </p>
        <p className="mt-2 text-3xl font-semibold">
          {topBuilding ? `Edificio ${topBuilding.number}` : "—"}
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {topBuilding
            ? `${topBuilding.count} ${
                topBuilding.count === 1 ? "reporte" : "reportes"
              }`
            : "Sin reportes registrados"}
        </p>
      </div>
    </div>
  );
}
