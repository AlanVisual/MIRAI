import Image from "next/image";
import Link from "next/link";

import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTime } from "@/lib/format";
import type { AdminTicket } from "@/types/ticket";

const MAX_PREVIEWS = 4;

export function AdminTicketCard({ ticket }: { ticket: AdminTicket }) {
  const photos = ticket.attachments.slice(0, MAX_PREVIEWS);
  const remaining = ticket.attachments.length - photos.length;

  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-black/[.08] bg-white p-5 transition-colors hover:border-black/[.16] dark:border-white/[.145] dark:bg-zinc-950 dark:hover:border-white/[.24]"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="truncate text-base font-medium group-hover:underline">
            {ticket.title}
          </h2>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Reportado por {ticket.author.name}
          </p>
        </div>
        <StatusBadge status={ticket.status} />
      </div>

      <p className="line-clamp-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {ticket.description}
      </p>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
        <span>
          Edificio {ticket.building.number} · {ticket.location.name}
        </span>
        <span aria-hidden="true">•</span>
        <time dateTime={ticket.createdAt.toISOString()}>
          {formatDateTime(ticket.createdAt)}
        </time>
        {ticket.handler ? (
          <>
            <span aria-hidden="true">•</span>
            <span>Atendido por {ticket.handler.name}</span>
          </>
        ) : null}
      </div>

      {photos.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="relative h-16 w-16 overflow-hidden rounded-lg bg-zinc-100 sm:h-20 sm:w-20 dark:bg-zinc-900"
            >
              <Image
                src={photo.url}
                alt={`Evidencia ${index + 1} de ${ticket.title}`}
                fill
                sizes="80px"
                className="object-cover"
              />
              {index === photos.length - 1 && remaining > 0 ? (
                <span className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs font-medium text-white">
                  +{remaining}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      <span className="text-sm font-medium underline-offset-4 group-hover:underline">
        Ver detalle →
      </span>
    </Link>
  );
}
