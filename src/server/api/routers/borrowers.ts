import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { eq, inArray } from "drizzle-orm";
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
      const user = ctx.session.user;
      input.createdBy = user.id;
      console.log(input);
      await ctx.db.insert(borrowers).values(input);
    }),
  list: protectedProcedure
    .input(BorrowersSelectSchema.optional())
    .query(async ({ ctx }) => {
      const user = ctx.session.user;
      console.log(user.id);

      // Step 1: Fetch all borrowers created by the user
      const borrowersQueryResult = await ctx.db
        .select()
        .from(borrowers)
        .where(eq(borrowers.createdBy, user.id));

      // Extract borrower IDs
      const borrowerIds = borrowersQueryResult.map((borrower) => borrower.id);

      // Step 2: Fetch loans for the retrieved borrowers
      const loansQueryResult = await ctx.db
        .select()
        .from(loans)
        .where(inArray(loans.borrowerId, borrowerIds));

      // Step 3: Group loans by borrower ID
      const loansGroupedByBorrowerId = groupBy(
        loansQueryResult,
        (loan) => loan.borrowerId,
      );

      // Step 4: Format the result
      const result = borrowersQueryResult.map((borrower) => {
        const loans = loansGroupedByBorrowerId[borrower.id] ?? []; // Default to empty array if no loans
        return {
          ...borrower,
          loans,
        } as BorrowersSelectInput & { loans: LoansSelectInput[] };
      });

      console.log(result.length);

      return result;
    }),
});
