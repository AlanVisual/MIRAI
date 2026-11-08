import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 bg-zinc-50 px-6 py-24 font-sans dark:bg-black">
      <span className="rounded-full border border-black/[.08] px-3 py-1 text-xs font-medium uppercase tracking-wider text-zinc-600 dark:border-white/[.145] dark:text-zinc-400">
        MIRAI
      </span>
      <h1 className="max-w-2xl text-center text-4xl font-semibold tracking-tight text-black dark:text-zinc-50">
        Sistema Escolar de Reporte de Tickets
      </h1>
      <p className="max-w-xl text-center text-lg leading-8 text-zinc-600 dark:text-zinc-400">
        Los maestros reportan incidencias por edificio y ubicación; los
        encargados las reciben, atienden y resuelven.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/login"
          className="flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/register"
          className="flex h-11 items-center justify-center rounded-full border border-black/[.12] px-6 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.08]"
        >
          Crear cuenta
        </Link>
      </div>
    </main>
  );
}
