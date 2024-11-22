import { pgEnum } from "drizzle-orm/pg-core";

export const paymentStatuses = pgEnum("payment_statuses", [
  "PENDING", // Payment is awaiting processing
  "COMPLETED", // Payment has been successfully completed
  "EXPIRED", // Payment has expired due to timeout or inactivity
]);

export type PaymentStatus = (typeof paymentStatuses.enumValues)[number];
