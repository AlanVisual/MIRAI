import { Role } from "@prisma/client";
import type { User } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

type SupabaseUserLike = {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
};

export async function syncUserProfile(user: SupabaseUserLike): Promise<User> {
  const metadata = user.user_metadata ?? {};
  const metadataName = metadata.name;
  const metadataRole = metadata.role;

  const name =
    typeof metadataName === "string" && metadataName.trim()
      ? metadataName.trim()
      : (user.email?.split("@")[0] ?? "Usuario");

  const role =
    metadataRole === Role.ENCARGADO ? Role.ENCARGADO : Role.MAESTRO;

  return prisma.user.upsert({
    where: { id: user.id },
    update: {},
    create: {
      id: user.id,
      email: user.email ?? `${user.id}@sin-correo.local`,
      name,
      role,
    },
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return syncUserProfile(user);
}
