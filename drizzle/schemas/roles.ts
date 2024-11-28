import { pgEnum } from "drizzle-orm/pg-core";

export const roles = pgEnum("finance-app_roles", [
  "NOT_VERIFIED",
  "ADMIN",
  "EDITOR",
  "OPERATOR",
  "READER",
  "VIEWER",
]);

// Extract the type from roles.enumValues
export type Roles = (typeof roles.enumValues)[number];
export const RolesArry = roles.enumValues;
