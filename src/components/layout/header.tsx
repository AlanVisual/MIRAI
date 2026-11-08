import Link from "next/link";

import { logoutAction } from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const roleLabels: Record<string, string> = {
  MAESTRO: "Maestro",
  ENCARGADO: "Encargado",
};

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  let name = user.email ?? "Usuario";
  let role = "MAESTRO";

  try {
    const profile = await prisma.user.findUnique({ where: { id: user.id } });

    if (profile) {
      name = profile.name;
      role = profile.role;
    } else {
      const metadataName = user.user_metadata?.name;
      if (typeof metadataName === "string" && metadataName.trim()) {
        name = metadataName;
      }

      const metadataRole = user.user_metadata?.role;
      if (typeof metadataRole === "string") {
        role = metadataRole;
      }
    }
  } catch (cause) {
    console.error("No se pudo cargar el perfil del usuario:", cause);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/[.08] bg-white/80 backdrop-blur dark:border-white/[.145] dark:bg-black/80">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-lg font-semibold tracking-tight"
          >
            MIRAI
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            <Link
              href="/dashboard"
              className="rounded-md px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-black/[.04] hover:text-foreground dark:text-zinc-400 dark:hover:bg-white/[.08]"
            >
              Dashboard
            </Link>
            <Link
              href="/tickets"
              className="rounded-md px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-black/[.04] hover:text-foreground dark:text-zinc-400 dark:hover:bg-white/[.08]"
            >
              Tickets
            </Link>
            {role === "ENCARGADO" ? (
              <Link
                href="/admin"
                className="rounded-md px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-black/[.04] hover:text-foreground dark:text-zinc-400 dark:hover:bg-white/[.08]"
              >
                Panel
              </Link>
            ) : null}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium leading-tight">{name}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {roleLabels[role] ?? role}
            </p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-full border border-black/[.08] px-4 py-2 text-sm font-medium transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-white/[.08]"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
