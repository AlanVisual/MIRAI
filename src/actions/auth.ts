"use server";

import { Role } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { syncUserProfile } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import type { AuthState } from "@/types/user";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function registerAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const name = getString(formData, "name");
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");
  const role =
    getString(formData, "role") === Role.ENCARGADO
      ? Role.ENCARGADO
      : Role.MAESTRO;

  if (!name || !email || !password) {
    return { error: "Completa todos los campos." };
  }

  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  const origin = (await headers()).get("origin") ?? "http://localhost:3000";
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    try {
      await prisma.user.upsert({
        where: { id: data.user.id },
        update: { name, email, role },
        create: { id: data.user.id, email, name, role },
      });
    } catch (cause) {
      console.error("No se pudo sincronizar el usuario con Prisma:", cause);
      return {
        error:
          "La cuenta se creó, pero no se pudo guardar el perfil. Inicia sesión para reintentar la sincronización.",
      };
    }
  }

  if (data.session) {
    redirect(role === Role.ENCARGADO ? "/admin" : "/dashboard");
  }

  return {
    success:
      "Cuenta creada. Revisa tu correo para confirmarla y luego inicia sesión.",
  };
}

export async function loginAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");

  if (!email || !password) {
    return { error: "Ingresa tu correo y contraseña." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Correo o contraseña incorrectos." };
  }

  let destination = "/dashboard";

  if (data.user) {
    try {
      const profile = await syncUserProfile(data.user);

      if (profile.role === Role.ENCARGADO) {
        destination = "/admin";
      }
    } catch (cause) {
      console.error("No se pudo sincronizar el usuario con Prisma:", cause);
    }
  }

  redirect(destination);
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
