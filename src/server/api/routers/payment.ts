import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { eq } from "drizzle-orm";

import {
  payments,
  PaymentsInsertSchema,
  PaymentsSelectSchema,
} from "drizzle/schemas/payments";
import { z } from "zod";

export const paymentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(PaymentsInsertSchema)
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.insert(payments).values(input);
      console.log(result);
      return result;
    }),
  list: protectedProcedure
    .input(PaymentsSelectSchema.optional())
    .query(async ({ ctx }) => {
      const queryResult = await ctx.db.select().from(payments);

      return queryResult;
    }),
  findById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const payment = await ctx.db
        .select()
        .from(payments)
        .where(eq(payments.id, input)) // Use the input (id) to filter the record
        .limit(1);

      return payment[0];
    }),
});
