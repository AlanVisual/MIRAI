import Link from "next/link";
import { redirect } from "next/navigation";

import { CreateTicketForm } from "@/components/tickets/create-ticket-form";
import { getCurrentUser } from "@/lib/auth";

export default async function NewTicketPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "ENCARGADO") {
    redirect("/tickets");
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <Link
          href="/tickets"
          className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400"
        >
          ← Volver a tickets
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Nuevo ticket
        </h1>
        <p className="mt-1 text-zinc-600 dark:text-zinc-400">
          Describe la incidencia, indica su ubicación y adjunta fotos de
          evidencia.
        </p>
      </div>

      <div className="rounded-2xl border border-black/[.08] bg-white p-6 dark:border-white/[.145] dark:bg-zinc-950">
        <CreateTicketForm />
      </div>
    </div>
  );
}
