import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getTicketStats } from "@/actions/stats";
import { getAdminTickets } from "@/actions/ticket-queries";
import { AdminTicketCard } from "@/components/dashboard/admin-ticket-card";
import { TicketFilters } from "@/components/dashboard/ticket-filters";
import { TicketStats } from "@/components/dashboard/ticket-stats";
import { getCurrentUser } from "@/lib/auth";
import type { TicketSortOrder, TicketStatusFilter } from "@/types/ticket";

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

async function AdminContent({ searchParams }: { searchParams: SearchParams }) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "ENCARGADO") {
    redirect("/dashboard");
  }

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

function AdminSkeleton() {
  return (
    <div className="flex flex-col gap-5" aria-hidden="true">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[0, 1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl border border-black/[.08] bg-black/[.03] dark:border-white/[.145] dark:bg-white/[.04]"
          />
        ))}
      </div>
      <div className="h-24 animate-pulse rounded-2xl border border-black/[.08] bg-black/[.03] dark:border-white/[.145] dark:bg-white/[.04]" />
      <div className="h-40 animate-pulse rounded-2xl border border-black/[.08] bg-black/[.03] dark:border-white/[.145] dark:bg-white/[.04]" />
      <div className="h-40 animate-pulse rounded-2xl border border-black/[.08] bg-black/[.03] dark:border-white/[.145] dark:bg-white/[.04]" />
    </div>
  );
}

export default function AdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Panel de encargado
        </h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Todos los tickets registrados en la escuela, con indicadores, búsqueda
          y filtros avanzados.
        </p>
      </div>

      <Suspense fallback={<AdminSkeleton />}>
        <AdminContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
