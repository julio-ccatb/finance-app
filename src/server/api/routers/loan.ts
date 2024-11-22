import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { eq } from "drizzle-orm";
import {
  loans,
  LoansInsertSchema,
  LoansSelectSchema,
} from "drizzle/schemas/loans";
import { payments } from "drizzle/schemas/payments";
import { z } from "zod";

export const loansRouter = createTRPCRouter({
  create: protectedProcedure
    .input(LoansInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.insert(loans).values(input);
      console.log(result);
      return result;
    }),
  list: protectedProcedure
    .input(LoansSelectSchema.optional())
    .query(async ({ ctx }) => {
      const queryResult = await ctx.db.select().from(loans);

      return queryResult;
    }),
  findById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const loan = await ctx.db
        .select()
        .from(loans)
        .leftJoin(payments, eq(loans.id, payments.loanId))
        .where(eq(loans.id, input)) // Use the input (id) to filter the record
        .limit(1);

      const result = { ...loan[0]?.loans, payments: loan[0]?.payments }; // Limit to 1 to get a single record
      console.log(result);
      return result;
    }),
});
