"use client";

import { useActionState } from "react";

import { updateTicketStatusAction } from "@/actions/tickets";
import type { TicketStatus, TicketStatusState } from "@/types/ticket";

const initialState: TicketStatusState = {};

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "EN_PROCESO", label: "En proceso" },
  { value: "RESUELTO", label: "Resuelto" },
  { value: "CANCELADO", label: "Cancelado" },
];

type TicketStatusFormProps = {
  ticketId: string;
  currentStatus: TicketStatus;
};

export function TicketStatusForm({
  ticketId,
  currentStatus,
}: TicketStatusFormProps) {
  const [state, formAction, pending] = useActionState(
    updateTicketStatusAction,
    initialState,
  );

  return (
    <section className="rounded-2xl border border-black/[.08] bg-white p-5 dark:border-white/[.145] dark:bg-zinc-950">
      <h2 className="text-lg font-semibold">Panel de control</h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        Actualiza el estado del ticket. Quedarás registrado como el encargado
        responsable.
      </p>

      <form action={formAction} className="mt-4 flex flex-wrap items-end gap-3">
        <input type="hidden" name="ticketId" value={ticketId} />
        <label className="flex min-w-44 flex-col gap-1.5 text-sm font-medium">
          Nuevo estado
          <select
            name="status"
            defaultValue={currentStatus}
            className="w-full rounded-lg border border-black/[.12] bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-zinc-500 dark:border-white/[.145] dark:bg-zinc-900 dark:focus:border-zinc-400"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Guardando..." : "Actualizar estado"}
        </button>
      </form>

      {state.error ? (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">
          {state.success}
        </p>
      ) : null}
    </section>
  );
}
