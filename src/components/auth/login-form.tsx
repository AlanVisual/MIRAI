"use client";

import Link from "next/link";
import { useActionState } from "react";

import { loginAction } from "@/actions/auth";
import type { AuthState } from "@/types/user";

const initialState: AuthState = {};

const inputClassName =
  "w-full rounded-lg border border-black/[.12] bg-white px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-500 dark:border-white/[.145] dark:bg-zinc-900 dark:focus:border-zinc-400";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Iniciar sesión</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Accede con tu correo institucional.
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        {state.error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/60 dark:text-red-300">
            {state.error}
          </p>
        ) : null}

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Correo
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="maestro@escuela.edu"
            className={inputClassName}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm font-medium">
          Contraseña
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={6}
            placeholder="••••••••"
            className={inputClassName}
          />
        </label>

        <button
          type="submit"
          disabled={pending}
          className="mt-1 flex h-11 w-full items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Ingresando..." : "Entrar"}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground underline underline-offset-4"
        >
          Regístrate
        </Link>
      </p>
    </div>
  );
}
