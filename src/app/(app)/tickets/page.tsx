import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getAllTickets, getTicketsForUser } from "@/actions/ticket-queries";
import { TicketCard } from "@/components/tickets/ticket-card";
import { getCurrentUser } from "@/lib/auth";

async function TicketsList({
  isManager,
  userId,
}: {
  isManager: boolean;
  userId: string;
}) {
  const tickets = isManager
    ? await getAllTickets()
    : await getTicketsForUser(userId);

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-black/[.12] p-10 text-center dark:border-white/[.145]">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {isManager
            ? "Aún no hay tickets reportados en la escuela."
            : "Aún no has reportado ningún ticket."}
        </p>
        {isManager ? null : (
          <Link
            href="/tickets/new"
            className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Crear primer reporte
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}

function TicketsSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="h-40 animate-pulse rounded-2xl border border-black/[.08] bg-black/[.03] sm:h-36 dark:border-white/[.145] dark:bg-white/[.04]"
        />
      ))}
    </div>
  );
}

export default async function TicketsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const isManager = user.role === "ENCARGADO";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tickets</h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            {isManager
              ? "Todos los tickets de la escuela. Abre uno para cambiar su estado."
              : "Historial de los tickets que has reportado."}
          </p>
        </div>
        {isManager ? null : (
          <Link
            href="/tickets/new"
            className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            + Nuevo ticket
          </Link>
        )}
      </div>

      <Suspense fallback={<TicketsSkeleton />}>
        <TicketsList isManager={isManager} userId={user.id} />
      </Suspense>
    </div>
  );
}
