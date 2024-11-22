import { pgEnum } from "drizzle-orm/pg-core";

export const paymentStatuses = pgEnum("payment_statuses", [
  "PENDING", // Payment is awaiting processing
  "COMPLETED", // Payment has been successfully completed
  "EXPIRED", // Payment has expired due to timeout or inactivity
]);

export type PaymentStatus = (typeof paymentStatuses.enumValues)[number];
export const PaymentStatusArray = paymentStatuses.enumValues;

export const paymentType = pgEnum("payment_statuses", [
  "PAYMENT",
  "INTREST",
  "SURCHARGE",
]);

export type PaymentType = (typeof paymentType.enumValues)[number];
export const PaymentTypeArray = paymentType.enumValues;
