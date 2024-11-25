import { decimalStringValidator } from "@/lib/zod/utils";
import { relations } from "drizzle-orm";
import { date, numeric, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createTable } from "drizzle/util";
import { type z } from "zod";
import { borrowers } from "./borrowers";
import { loanStatuses } from "./loan-status";
import { payments } from "./payments";

export const loans = createTable("loans", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()), // UUID as a string
  borrowerId: varchar("borrower_id")
    .notNull()
    .references(() => borrowers.id), // Foreign key linking to the borrower
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(), // Total loan amount
  surcharge: numeric("surcharge", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"), // Total loan surcharge
  winnings: numeric("winnings", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"), // Total loan surcharge
  balance: numeric("balance", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"), // Amount paid by the borrower
  interestRate: numeric("interest_rate", { precision: 5, scale: 2 }).default(
    "10.00",
  ), // Annual interest rate (%)
  startDate: date("start_date").notNull(), // Start date of the loan
  dueDate: date("due_date").notNull(), // When the loan must be repaid
  status: loanStatuses("status").notNull().default("ACTIVE"), // Loan status (e.g., pending, completed)
  createdAt: date("created_at").defaultNow(), // When the loan was issued
});

export const loansRelations = relations(loans, ({ one, many }) => ({
  borrower: one(borrowers, {
    fields: [loans.borrowerId],
    references: [borrowers.id],
  }),
  payments: many(payments),
}));

export const LoansInsertSchema = createInsertSchema(loans, {
  amount: decimalStringValidator,
  surcharge: decimalStringValidator,
  winnings: decimalStringValidator,
  balance: decimalStringValidator,
  interestRate: decimalStringValidator,
});
export const LoansSelectSchema = createSelectSchema(loans);

export type LoansCreateInput = z.infer<typeof LoansInsertSchema>;
export type LoansSelectInput = z.infer<typeof LoansSelectSchema>;
