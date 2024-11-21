import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  loans,
  LoansInsertSchema,
  LoansSelectSchema,
} from "drizzle/schemas/loans";

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
});
