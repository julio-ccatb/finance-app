import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type z } from "zod";
import { decimal, integer, text, timestamp } from "drizzle-orm/pg-core";
import { createTable } from "./schema";

export const books = createTable("books", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull().unique(),
  type: text("type").notNull(), // e.g., "Asset", "Liability", "Equity", etc.
  description: text("description"),
});

export const transactions = createTable("transactions", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  bookId: integer("book_id")
    .notNull()
    .references(() => books.id),
  date: timestamp("date").notNull(), // Date of the transaction
  amount: decimal("amount").notNull(), // Positive for credit, negative for debit
  description: text("description"),
});

export const createTransactionSchema = createInsertSchema(transactions);
export const selectTransactionSchemaSchema = createSelectSchema(transactions);

export type CreateTransaction = z.infer<typeof createTransactionSchema>;
export type SelectTransaction = z.infer<typeof selectTransactionSchemaSchema>;
