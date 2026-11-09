import Link from "next/link";
import { redirect } from "next/navigation";

import { getTicketStats } from "@/actions/stats";
import { getAdminTickets, getTicketsForUser } from "@/actions/ticket-queries";
import { AdminTicketCard } from "@/components/dashboard/admin-ticket-card";
import { TicketStats } from "@/components/dashboard/ticket-stats";
import { TicketCard } from "@/components/tickets/ticket-card";
import { getCurrentUser } from "@/lib/auth";

const createButtonClassName =
  "inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "ENCARGADO") {
    const [tickets, stats] = await Promise.all([
      getAdminTickets({
        status: "TODOS",
        building: "TODOS",
        query: "",
        sort: "desc",
      }),
      getTicketStats(),
    ]);

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            Resumen general del sistema de tickets escolares.
          </p>
        </div>

        <TicketStats {...stats} />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Todos los tickets</h2>
          <Link
            href="/admin"
            className="text-sm font-medium text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
          >
            Abrir panel con filtros →
          </Link>
        </div>

        {tickets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/[.12] p-10 text-center dark:border-white/[.145]">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Aún no hay tickets reportados en la escuela.
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
          <h1 className="text-2xl font-semibold tracking-tight">Mis reportes</h1>
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
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
