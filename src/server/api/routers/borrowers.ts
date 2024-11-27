import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { eq } from "drizzle-orm";
import {
  borrowers,
  BorrowersInsertSchema,
  type BorrowersSelectInput,
  BorrowersSelectSchema,
} from "drizzle/schemas/borrowers";
import { loans, type LoansSelectInput } from "drizzle/schemas/loans";
import { groupBy } from "lodash";

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
      const user = ctx.session.user;
      console.log(user.id);
      const queryResult = await ctx.db

        .select()
        .from(borrowers)
        .leftJoin(loans, eq(borrowers.id, loans.borrowerId))
        .where(eq(loans.ownerId, user.id));

      // Group loans by borrower ID
      const groupedByBorrower = groupBy(
        queryResult,
        (item) => item.borrowers.id,
      );

      // Transform the grouped data
      const result = Object.values(groupedByBorrower).map((group) => {
        const borrower = group[0]?.borrowers; // The borrower details
        const loans = group
          .filter((item) => item.loans) // Filter out rows with no loans
          .map((item) => item.loans); // Extract loan details
        return {
          ...borrower,
          loans,
        } as BorrowersSelectInput & { loans: LoansSelectInput[] };
      });

      return result;
    }),
});
