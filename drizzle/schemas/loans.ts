import { relations } from "drizzle-orm";
import { date, numeric, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createTable } from "drizzle/util";
import { type z } from "zod";
import { borrowers } from "./borrowers";
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
  interestRate: numeric("interest_rate", { precision: 5, scale: 2 }).default(
    "120.00",
  ), // Annual interest rate (%)
  startDate: date("start_date").notNull(), // Start date of the loan
  dueDate: date("due_date").notNull(), // When the loan must be repaid
  status: text("status").default("pending"), // Loan status (e.g., pending, completed)
  createdAt: date("created_at").defaultNow(), // When the loan was issued
});

export const loansRelations = relations(loans, ({ one, many }) => ({
  borrower: one(borrowers, {
    fields: [loans.borrowerId],
    references: [borrowers.id],
  }),
  payments: many(payments),
}));

export const LoansInsertSchema = createInsertSchema(loans);
export const LoansSelectSchema = createSelectSchema(loans);

export type LoansCreateInput = z.infer<typeof LoansInsertSchema>;
export type LoansSelectInput = z.infer<typeof LoansSelectSchema>;
