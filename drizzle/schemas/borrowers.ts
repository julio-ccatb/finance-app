import { relations } from "drizzle-orm";
import { date, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { createTable } from "drizzle/util";
import { type z } from "zod";
import { loans } from "./loans";
import { users } from "./schema";

export const borrowers = createTable("borrowers", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  createdBy: varchar("created_by").references(() => users.id), // Foreign key linking to the user
  name: text("name").notNull(), // Full name of the borrower
  email: text("email"), // Email of the borrower (optional)
  phone: text("phone"), // Phone number (optional)
  createdAt: date("created_at").defaultNow(), // When the borrower was added
});

export const borrowersRelations = relations(borrowers, ({ many, one }) => ({
  loans: many(loans),
  creator: one(users, {
    fields: [borrowers.createdBy],
    references: [users.id],
  }),
}));

export const BorrowersInsertSchema = createInsertSchema(borrowers, {
  email: (schema) => schema.email.email(),
});
export const BorrowersSelectSchema = createSelectSchema(borrowers, {
  email: (schema) => schema.email.email(),
});

export type BorrowersCreateInput = z.infer<typeof BorrowersInsertSchema>;
export type BorrowersSelectInput = z.infer<typeof BorrowersSelectSchema>;
