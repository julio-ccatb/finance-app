import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { borrowers, BorrowersInsertSchema } from "drizzle/schemas/borrowers";

export const borrowerRouter = createTRPCRouter({
  create: protectedProcedure
    .input(BorrowersInsertSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(borrowers).values(input);
    }),
});
