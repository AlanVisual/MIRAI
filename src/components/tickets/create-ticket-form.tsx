"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { createTicketAction } from "@/actions/tickets";
import type { TicketFormState } from "@/types/ticket";

const initialState: TicketFormState = {};
const buildingNumbers = Array.from({ length: 24 }, (_, index) => index + 1);

const inputClassName =
  "w-full rounded-lg border border-black/[.12] bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 dark:border-white/[.145] dark:bg-zinc-900 dark:focus:border-zinc-400";

type Preview = {
  name: string;
  url: string;
};

export function CreateTicketForm() {
  const [state, formAction, pending] = useActionState(
    createTicketAction,
    initialState,
  );
  const [previews, setPreviews] = useState<Preview[]>([]);
  const previewsRef = useRef<Preview[]>([]);

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  useEffect(() => {
    return () => {
      previewsRef.current.forEach((preview) => {
        URL.revokeObjectURL(preview.url);
      });
    };
  }, []);

  function handleFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    previews.forEach((preview) => {
      URL.revokeObjectURL(preview.url);
    });

    const files = Array.from(event.target.files ?? []);
    setPreviews(
      files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/60 dark:text-red-300">
          {state.error}
        </p>
      ) : null}

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Título
        <input
          name="title"
          type="text"
          required
          maxLength={120}
          placeholder="Fuga de agua en el baño"
          className={inputClassName}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Descripción
        <textarea
          name="description"
          required
          rows={5}
          maxLength={2000}
          placeholder="Describe el problema con el mayor detalle posible."
          className={`${inputClassName} resize-y`}
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Edificio
          <select
            name="buildingNumber"
            required
            defaultValue=""
            className={inputClassName}
          >
            <option value="" disabled>
              Selecciona un edificio
            </option>
            {buildingNumbers.map((number) => (
              <option key={number} value={number}>
                Edificio {number}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Ubicación / salón
          <input
            name="locationName"
            type="text"
            required
            maxLength={120}
            placeholder="Salón 204, segundo piso"
            className={inputClassName}
          />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Fotos de evidencia
          <input
            name="photos"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFilesChange}
            className="w-full cursor-pointer rounded-lg border border-dashed border-black/[.12] bg-white px-3 py-3 text-sm text-zinc-600 file:mr-3 file:rounded-full file:border-0 file:bg-foreground file:px-4 file:py-1.5 file:text-sm file:font-medium file:text-background dark:border-white/[.145] dark:bg-zinc-900 dark:text-zinc-400"
          />
        </label>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Hasta 6 imágenes, máximo 5 MB por archivo.
        </p>

        {previews.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {previews.map((preview) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={preview.url}
                src={preview.url}
                alt={preview.name}
                className="h-20 w-full rounded-lg border border-black/[.08] object-cover dark:border-white/[.145]"
              />
            ))}
          </div>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 flex h-11 w-full items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Creando ticket..." : "Crear ticket"}
      </button>
    </form>
  );
}
