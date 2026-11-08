import type { Role, User } from "@prisma/client";

export type UserRole = Role;

export type UserProfile = Pick<User, "id" | "email" | "name" | "role">;

export type AuthState = {
  error?: string;
  success?: string;
};
