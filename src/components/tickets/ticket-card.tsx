import Image from "next/image";
import Link from "next/link";

import { StatusBadge } from "@/components/ui/status-badge";
import { formatDateTime } from "@/lib/format";
import type { TicketWithRelations } from "@/types/ticket";

const MAX_PREVIEWS = 4;

export function TicketCard({ ticket }: { ticket: TicketWithRelations }) {
  const photos = ticket.attachments.slice(0, MAX_PREVIEWS);
  const remaining = ticket.attachments.length - photos.length;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-black/[.08] bg-white p-5 dark:border-white/[.145] dark:bg-zinc-950">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-base font-medium">{ticket.title}</h2>
        <StatusBadge status={ticket.status} />
      </div>

      <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
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

      <Link
        href={`/tickets/${ticket.id}`}
        className="text-sm font-medium underline-offset-4 hover:underline"
      >
        Ver detalle →
      </Link>
    </article>
  );
}
