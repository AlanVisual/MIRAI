import Link from "next/link";
import { redirect } from "next/navigation";

import { getTicketStats } from "@/actions/stats";
import { getAdminTickets, getTicketsForUser } from "@/actions/ticket-queries";
import { AdminTicketCard } from "@/components/dashboard/admin-ticket-card";
import { TicketFilters } from "@/components/dashboard/ticket-filters";
import { TicketStats } from "@/components/dashboard/ticket-stats";
import { TicketCard } from "@/components/tickets/ticket-card";
import { getCurrentUser } from "@/lib/auth";
import type { TicketSortOrder, TicketStatusFilter } from "@/types/ticket";

const createButtonClassName =
  "inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90";

const validStatuses = [
  "PENDIENTE",
  "EN_PROCESO",
  "RESUELTO",
  "CANCELADO",
] as const;

type ValidStatus = (typeof validStatuses)[number];
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getSingle(value: string | string[] | undefined) {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return "";
}

function parseStatus(
  value: string | string[] | undefined,
): TicketStatusFilter {
  const status = getSingle(value);

  return validStatuses.includes(status as ValidStatus)
    ? (status as ValidStatus)
    : "TODOS";
}

function parseBuilding(value: string | string[] | undefined) {
  const building = Number.parseInt(getSingle(value), 10);

  return Number.isInteger(building) && building >= 1 && building <= 24
    ? String(building)
    : "TODOS";
}

function parseQuery(value: string | string[] | undefined) {
  return getSingle(value).trim();
}

function parseSort(
  value: string | string[] | undefined,
): TicketSortOrder {
  return getSingle(value) === "asc" ? "asc" : "desc";
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "ENCARGADO") {
    const params = await searchParams;
    const status = parseStatus(params.status);
    const building = parseBuilding(params.building);
    const query = parseQuery(params.q);
    const sort = parseSort(params.sort);

    const [tickets, stats] = await Promise.all([
      getAdminTickets({ status, building, query, sort }),
      getTicketStats(),
    ]);

    return (
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Todos los tickets de la escuela. Abre uno para cambiar su estado.
          </p>
        </div>

        <TicketStats {...stats} />

        <TicketFilters
          status={status}
          building={building}
          query={query}
          sort={sort}
        />

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {tickets.length} {tickets.length === 1 ? "ticket" : "tickets"}
        </p>

        {tickets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/[.12] p-10 text-center dark:border-white/[.145]">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              No hay tickets que coincidan con los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {tickets.map((ticket) => (
              <AdminTicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const tickets = await getTicketsForUser(user.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Consulta el estado de los tickets que has reportado.
          </p>
        </div>
        <Link href="/tickets/new" className={createButtonClassName}>
          + Crear Nuevo Reporte
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-black/[.12] p-10 text-center dark:border-white/[.145]">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Aún no has reportado ningún ticket.
          </p>
          <Link href="/tickets/new" className={createButtonClassName}>
            Crear primer reporte
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">Mis reportes</h2>
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
