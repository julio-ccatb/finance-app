import { date, numeric, varchar } from "drizzle-orm/pg-core";
import { createTable } from "./schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type z } from "zod";
import { loans } from "./loans";
import { relations } from "drizzle-orm";

export const payments = createTable("payments", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  loanId: varchar("loan_id")
    .notNull()
    .references(() => loans.id), // Foreign key linking to the loan
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(), // Amount paid
  paymentDate: date("payment_date").defaultNow(), // Date of payment
  createdAt: date("created_at").defaultNow(), // Timestamp of the payment record
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  loan: one(loans, {
    fields: [payments.loanId],
    references: [loans.id],
    relationName: "loan_payment",
  }),
}));

export const PaymentsInsertSchema = createInsertSchema(payments);
export const PaymentsSelectSchema = createSelectSchema(payments);

export type PaymentsCreateInput = z.infer<typeof PaymentsInsertSchema>;
export type PaymentsSelectInput = z.infer<typeof PaymentsSelectSchema>;
