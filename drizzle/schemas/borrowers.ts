import { date, text, uuid, varchar } from "drizzle-orm/pg-core";
import { createTable } from "./schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type z } from "zod";
import { relations } from "drizzle-orm";
import { loans } from "./loans";

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

export const BorrowersInsertSchema = createInsertSchema(borrowers);
export const BorrowersSelectSchema = createSelectSchema(borrowers);

export type BorrowersCreateInput = z.infer<typeof BorrowersInsertSchema>;
export type BorrowersSelectInput = z.infer<typeof BorrowersSelectSchema>;
