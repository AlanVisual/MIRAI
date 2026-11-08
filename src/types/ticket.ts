import type { Prisma, TicketStatus as PrismaTicketStatus } from "@prisma/client";

export type TicketStatus = PrismaTicketStatus;

export type TicketWithRelations = Prisma.TicketGetPayload<{
  include: {
    building: true;
    location: true;
    attachments: true;
  };
}>;

export type AdminTicket = Prisma.TicketGetPayload<{
  include: {
    author: true;
    handler: true;
    building: true;
    location: true;
    attachments: true;
  };
}>;

export type TicketStatsData = {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  topBuilding: { number: number; count: number } | null;
};

export type TicketSortOrder = "asc" | "desc";

export type TicketStatusFilter = TicketStatus | "TODOS";

export type AdminTicketFilters = {
  status: TicketStatusFilter;
  building: string;
  query: string;
  sort: TicketSortOrder;
};

export type TicketFormState = {
  error?: string;
};

export type TicketStatusState = {
  error?: string;
  success?: string;
};
