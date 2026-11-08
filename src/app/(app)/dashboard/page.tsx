import Link from "next/link";
import { Suspense } from "react";

import { getTicketStats } from "@/actions/stats";
import { TicketStats } from "@/components/dashboard/ticket-stats";

const cards = [
  {
    title: "Reportar un ticket",
    description:
      "Registra una incidencia indicando el edificio y la ubicación exacta.",
    href: "/tickets/new",
    cta: "Reportar ticket →",
  },
  {
    title: "Tickets asignados",
    description:
      "Los encargados reciben y dan seguimiento a los tickets pendientes.",
    href: "/tickets",
    cta: "Ver tickets →",
  },
  {
    title: "Historial",
    description:
      "Consulta los tickets resueltos o cancelados y su trazabilidad.",
    href: "/tickets",
    cta: "Ver historial →",
  },
];

async function DashboardStats() {
  const stats = await getTicketStats();

  return <TicketStats {...stats} />;
}

function StatsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="h-28 animate-pulse rounded-2xl border border-black/[.08] bg-black/[.03] dark:border-white/[.145] dark:bg-white/[.04]"
        />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Resumen general del sistema de tickets escolares.
        </p>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group flex flex-col gap-2 rounded-2xl border border-black/[.08] bg-white p-5 transition-colors hover:border-black/[.16] dark:border-white/[.145] dark:bg-zinc-950 dark:hover:border-white/[.24]"
          >
            <h2 className="font-medium">{card.title}</h2>
            <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {card.description}
            </p>
            <span className="mt-2 text-sm font-medium text-foreground underline-offset-4 group-hover:underline">
              {card.cta}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
