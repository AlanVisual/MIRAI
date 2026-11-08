import { prisma } from "@/lib/prisma";
import type { TicketStatsData } from "@/types/ticket";

export async function getTicketStats(): Promise<TicketStatsData> {
  const [total, pending, inProgress, resolved, topBuilding] = await Promise.all([
    prisma.ticket.count(),
    prisma.ticket.count({ where: { status: "PENDIENTE" } }),
    prisma.ticket.count({ where: { status: "EN_PROCESO" } }),
    prisma.ticket.count({ where: { status: "RESUELTO" } }),
    prisma.building.findFirst({
      where: { tickets: { some: {} } },
      orderBy: { tickets: { _count: "desc" } },
      select: { number: true, _count: { select: { tickets: true } } },
    }),
  ]);

  return {
    total,
    pending,
    inProgress,
    resolved,
    topBuilding: topBuilding
      ? { number: topBuilding.number, count: topBuilding._count.tickets }
      : null,
  };
}
