import Link from "next/link";

import type { TicketSortOrder, TicketStatusFilter } from "@/types/ticket";

const statusOptions = [
  { value: "TODOS", label: "Todos los estados" },
  { value: "PENDIENTE", label: "Pendiente" },
  { value: "EN_PROCESO", label: "En proceso" },
  { value: "RESUELTO", label: "Resuelto" },
  { value: "CANCELADO", label: "Cancelado" },
];

const sortOptions = [
  { value: "desc", label: "Más recientes primero" },
  { value: "asc", label: "Más antiguos primero" },
];

const buildingNumbers = Array.from({ length: 24 }, (_, index) => index + 1);

const fieldClassName =
  "w-full rounded-lg border border-black/[.12] bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-zinc-500 dark:border-white/[.145] dark:bg-zinc-900 dark:focus:border-zinc-400";

type TicketFiltersProps = {
  status: TicketStatusFilter;
  building: string;
  query: string;
  sort: TicketSortOrder;
};

export function TicketFilters({
  status,
  building,
  query,
  sort,
}: TicketFiltersProps) {
  return (
    <form
      method="get"
      action="/dashboard"
      className="flex flex-wrap items-end gap-3 rounded-2xl border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-950"
    >
      <label className="flex min-w-60 flex-[2] flex-col gap-1.5 text-sm font-medium">
        Buscar
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Título o palabras clave de la descripción..."
          className={fieldClassName}
        />
      </label>

      <label className="flex min-w-40 flex-1 flex-col gap-1.5 text-sm font-medium">
        Estado
        <select name="status" defaultValue={status} className={fieldClassName}>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex min-w-40 flex-1 flex-col gap-1.5 text-sm font-medium">
        Edificio
        <select
          name="building"
          defaultValue={building}
          className={fieldClassName}
        >
          <option value="TODOS">Todos los edificios</option>
          {buildingNumbers.map((number) => (
            <option key={number} value={number}>
              Edificio {number}
            </option>
          ))}
        </select>
      </label>

      <label className="flex min-w-44 flex-1 flex-col gap-1.5 text-sm font-medium">
        Ordenar por fecha
        <select name="sort" defaultValue={sort} className={fieldClassName}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Filtrar
        </button>
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center justify-center rounded-full border border-black/[.12] px-4 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.08]"
        >
          Limpiar
        </Link>
      </div>
    </form>
  );
}
