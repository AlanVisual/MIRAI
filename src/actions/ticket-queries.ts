import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type {
  AdminTicket,
  AdminTicketFilters,
  TicketWithRelations,
} from "@/types/ticket";

export async function getTicketsForUser(
  userId: string,
): Promise<TicketWithRelations[]> {
  return prisma.ticket.findMany({
    where: { authorId: userId },
    orderBy: { createdAt: "desc" },
    include: {
      building: true,
      location: true,
      attachments: true,
    },
  });
}

export async function getAllTickets(): Promise<TicketWithRelations[]> {
  return prisma.ticket.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      building: true,
      location: true,
      attachments: true,
    },
  });
}

export async function getAdminTickets({
  status,
  building,
  query,
  sort,
}: AdminTicketFilters): Promise<AdminTicket[]> {
  const where: Prisma.TicketWhereInput = {};

  if (status !== "TODOS") {
    where.status = status;
  }

  if (building !== "TODOS") {
    where.building = { number: Number(building) };
  }

  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  return prisma.ticket.findMany({
    where,
    orderBy: { createdAt: sort },
    include: {
      author: true,
      handler: true,
      building: true,
      location: true,
      attachments: true,
    },
  });
}

export async function getTicketById(id: string): Promise<AdminTicket | null> {
  return prisma.ticket.findUnique({
    where: { id },
    include: {
      author: true,
      handler: true,
      building: true,
      location: true,
      attachments: true,
    },
  });
}
