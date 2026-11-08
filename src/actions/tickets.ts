"use server";

import { randomUUID } from "node:crypto";

import { Role, TicketStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import type { TicketFormState, TicketStatusState } from "@/types/ticket";

const BUCKET = "ticket-photos";
const MAX_FILES = 6;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getExtension(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  return /^[a-z0-9]+$/.test(extension) ? extension : "jpg";
}

export async function createTicketAction(
  _prevState: TicketFormState,
  formData: FormData,
): Promise<TicketFormState> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const title = getString(formData, "title");
  const description = getString(formData, "description");
  const buildingNumber = Number.parseInt(
    getString(formData, "buildingNumber"),
    10,
  );
  const locationName = getString(formData, "locationName");

  if (!title || !description || !locationName) {
    return { error: "Completa el título, la descripción y la ubicación." };
  }

  if (
    !Number.isInteger(buildingNumber) ||
    buildingNumber < 1 ||
    buildingNumber > 24
  ) {
    return { error: "Selecciona un edificio entre 1 y 24." };
  }

  const files = formData
    .getAll("photos")
    .filter((value): value is File => value instanceof File && value.size > 0);

  if (files.length > MAX_FILES) {
    return { error: `Puedes subir hasta ${MAX_FILES} imágenes por ticket.` };
  }

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      return { error: `El archivo "${file.name}" no es una imagen válida.` };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        error: `La imagen "${file.name}" supera el límite de 5 MB.`,
      };
    }
  }

  const supabase = await createClient();
  const uploadedPaths: string[] = [];
  const attachmentUrls: string[] = [];

  for (const file of files) {
    const path = `${user.id}/${randomUUID()}.${getExtension(file)}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      if (uploadedPaths.length > 0) {
        await supabase.storage.from(BUCKET).remove(uploadedPaths);
      }

      return {
        error: `No se pudo subir la imagen "${file.name}": ${uploadError.message}`,
      };
    }

    uploadedPaths.push(path);

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    attachmentUrls.push(data.publicUrl);
  }

  try {
    const building = await prisma.building.upsert({
      where: { number: buildingNumber },
      update: {},
      create: {
        number: buildingNumber,
        name: `Edificio ${buildingNumber}`,
      },
    });

    const location =
      (await prisma.location.findFirst({
        where: { buildingId: building.id, name: locationName },
      })) ??
      (await prisma.location.create({
        data: { name: locationName, buildingId: building.id },
      }));

    await prisma.ticket.create({
      data: {
        title,
        description,
        authorId: user.id,
        buildingId: building.id,
        locationId: location.id,
        attachments: {
          create: attachmentUrls.map((url) => ({ url })),
        },
      },
    });
  } catch (cause) {
    console.error("No se pudo crear el ticket:", cause);

    if (uploadedPaths.length > 0) {
      await supabase.storage.from(BUCKET).remove(uploadedPaths);
    }

    return {
      error: "No se pudo crear el ticket. Inténtalo de nuevo.",
    };
  }

  revalidatePath("/tickets");
  revalidatePath("/dashboard");
  redirect("/tickets");
}

export async function updateTicketStatusAction(
  _prevState: TicketStatusState,
  formData: FormData,
): Promise<TicketStatusState> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== Role.ENCARGADO) {
    return {
      error: "Solo los encargados pueden cambiar el estado de un ticket.",
    };
  }

  const ticketId = getString(formData, "ticketId");
  const status = getString(formData, "status");

  if (!ticketId) {
    return { error: "Ticket inválido." };
  }

  if (!Object.values(TicketStatus).includes(status as TicketStatus)) {
    return { error: "Estado inválido." };
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    select: { id: true },
  });

  if (!ticket) {
    return { error: "El ticket no existe." };
  }

  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      status: status as TicketStatus,
      handlerId: user.id,
    },
  });

  revalidatePath(`/tickets/${ticketId}`);
  revalidatePath("/tickets");
  revalidatePath("/admin");
  revalidatePath("/dashboard");

  return { success: "Estado actualizado correctamente." };
}
