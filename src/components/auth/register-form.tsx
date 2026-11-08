"use client";

import Link from "next/link";
import { useActionState } from "react";

import { registerAction } from "@/actions/auth";
import type { AuthState } from "@/types/user";

const initialState: AuthState = {};

const inputClassName =
  "w-full rounded-lg border border-black/[.12] bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 dark:border-white/[.145] dark:bg-zinc-900 dark:focus:border-zinc-400";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    registerAction,
    initialState,
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Crear cuenta</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Registra tus datos para reportar o atender tickets.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        {state.error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/60 dark:text-red-300">
            {state.error}
          </p>
        ) : null}

        {state.success ? (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            {state.success}
          </p>
        ) : null}

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Nombre completo
          <input
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Ana Pérez"
            className={inputClassName}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Correo
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="ana@escuela.edu"
            className={inputClassName}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Contraseña
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            placeholder="Mínimo 6 caracteres"
            className={inputClassName}
          />
        </label>

        <fieldset className="flex flex-col gap-2">
          <legend className="mb-1 text-sm font-medium">Rol</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-black/[.12] px-3 py-2.5 text-sm transition-colors has-[:checked]:border-zinc-900 has-[:checked]:bg-black/[.04] dark:border-white/[.145] dark:has-[:checked]:border-zinc-100 dark:has-[:checked]:bg-white/[.08]">
              <input
                type="radio"
                name="role"
                value="MAESTRO"
                defaultChecked
                className="accent-foreground"
              />
              Maestro
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-black/[.12] px-3 py-2.5 text-sm transition-colors has-[:checked]:border-zinc-900 has-[:checked]:bg-black/[.04] dark:border-white/[.145] dark:has-[:checked]:border-zinc-100 dark:has-[:checked]:bg-white/[.08]">
              <input
                type="radio"
                name="role"
                value="ENCARGADO"
                className="accent-foreground"
              />
              Encargado
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={pending}
          className="mt-1 flex h-11 w-full items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Creando cuenta..." : "Registrarme"}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
