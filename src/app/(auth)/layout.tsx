import Link from "next/link";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="text-sm font-semibold uppercase tracking-[0.3em] text-zinc-500"
          >
            MIRAI
          </Link>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Sistema Escolar de Reporte de Tickets
          </p>
        </div>
        <div className="rounded-2xl border border-black/[.08] bg-white p-6 shadow-sm dark:border-white/[.145] dark:bg-zinc-950">
          {children}
        </div>
      </div>
    </main>
  );
}
