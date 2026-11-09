import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

import { getTicketById } from "@/actions/ticket-queries";
import { TicketStatusForm } from "@/components/tickets/ticket-status-form";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCurrentUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/format";

type Params = Promise<{ id: string }>;

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
        {label}
      </span>
      <span className="text-sm">{value}</span>
    </div>
  );
}

async function TicketDetail({ params }: { params: Params }) {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const ticket = await getTicketById(id);

  if (!ticket) {
    notFound();
  }

  const isEncargado = user.role === "ENCARGADO";

  if (!isEncargado && ticket.authorId !== user.id) {
    redirect("/dashboard");
  }

  const backHref = "/dashboard";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div>
        <Link
          href={backHref}
          className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
        >
          ← Volver
        </Link>

        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {ticket.title}
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Reportado por {ticket.author.name} ({ticket.author.email})
            </p>
          </div>
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      <section className="grid gap-4 rounded-2xl border border-black/[.08] bg-white p-5 sm:grid-cols-2 dark:border-white/[.145] dark:bg-zinc-950">
        <Field
          label="Edificio"
          value={`${ticket.building.number} — ${ticket.building.name}`}
        />
        <Field label="Ubicación exacta" value={ticket.location.name} />
        <Field
          label="Fecha de reporte"
          value={formatDateTime(ticket.createdAt)}
        />
        <Field
          label="Atendido por"
          value={ticket.handler?.name ?? "Sin asignar"}
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold">Descripción</h2>
        <p className="mt-2 text-sm leading-6 whitespace-pre-line text-zinc-700 dark:text-zinc-300">
          {ticket.description}
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">
          Fotos de evidencia ({ticket.attachments.length})
        </h2>

        {ticket.attachments.length === 0 ? (
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Este ticket no tiene fotos adjuntas.
          </p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {ticket.attachments.map((photo, index) => (
              <a
                key={photo.id}
                href={photo.url}
                target="_blank"
                rel="noreferrer"
                className="group relative block aspect-[4/3] overflow-hidden rounded-xl border border-black/[.08] bg-zinc-100 dark:border-white/[.145] dark:bg-zinc-900"
              >
                <Image
                  src={photo.url}
                  alt={`Evidencia ${index + 1} de ${ticket.title}`}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="object-contain transition-transform group-hover:scale-[1.02]"
                />
              </a>
            ))}
          </div>
        )}
      </section>

      {isEncargado ? (
        <TicketStatusForm
          ticketId={ticket.id}
          currentStatus={ticket.status}
        />
      ) : null}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6" aria-hidden="true">
      <div className="h-16 animate-pulse rounded-2xl border border-black/[.08] bg-black/[.03] dark:border-white/[.145] dark:bg-white/[.04]" />
      <div className="h-32 animate-pulse rounded-2xl border border-black/[.08] bg-black/[.03] dark:border-white/[.145] dark:bg-white/[.04]" />
      <div className="h-48 animate-pulse rounded-2xl border border-black/[.08] bg-black/[.03] dark:border-white/[.145] dark:bg-white/[.04]" />
    </div>
  );
}

export default function TicketDetailPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <TicketDetail params={params} />
    </Suspense>
  );
}
