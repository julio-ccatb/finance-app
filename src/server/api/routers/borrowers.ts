import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { eq } from "drizzle-orm";
import {
  borrowers,
  BorrowersInsertSchema,
  BorrowersSelectSchema,
} from "drizzle/schemas/borrowers";
import { loans } from "drizzle/schemas/loans";

export const borrowerRouter = createTRPCRouter({
  create: protectedProcedure
    .input(BorrowersInsertSchema)
    .mutation(async ({ ctx, input }) => {
      console.log(input);
      await ctx.db.insert(borrowers).values(input);
    }),
  list: protectedProcedure
    .input(BorrowersSelectSchema.optional())
    .query(async ({ ctx }) => {
      const queryResult = await ctx.db
        .select()
        .from(borrowers)
        .leftJoin(loans, eq(borrowers.id, loans.borrowerId));
      if (queryResult) console.log(queryResult);
      return queryResult;
    }),
});
