import { relations } from "drizzle-orm";
import { date, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type z } from "zod";
import { loans } from "./loans";
import { createTable } from "drizzle/util";

export const borrowers = createTable("borrowers", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(), // Full name of the borrower
  email: text("email"), // Email of the borrower (optional)
  phone: text("phone"), // Phone number (optional)
  createdAt: date("created_at").defaultNow(), // When the borrower was added
});

export const borrowersRelations = relations(borrowers, ({ many }) => ({
  loans: many(loans),
}));

export const BorrowersInsertSchema = createInsertSchema(borrowers, {
  email: (schema) => schema.email.email(),
});
export const BorrowersSelectSchema = createSelectSchema(borrowers, {
  email: (schema) => schema.email.email(),
});

export type BorrowersCreateInput = z.infer<typeof BorrowersInsertSchema>;
export type BorrowersSelectInput = z.infer<typeof BorrowersSelectSchema>;
