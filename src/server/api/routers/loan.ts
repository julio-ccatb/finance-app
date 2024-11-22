import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import Decimal from "decimal.js";
import { eq } from "drizzle-orm";
import {
  loans,
  LoansInsertSchema,
  LoansSelectSchema,
} from "drizzle/schemas/loans";
import { PaymentTypeArray } from "drizzle/schemas/payment-status";
import { payments, PaymentsCreateInput } from "drizzle/schemas/payments";
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
        .where(eq(loans.id, input)); // Use the input (id) to filter the record
      const formatedLoan = {
        ...loan[0]?.loans,
        payments: loan.map((item) => item.payments),
      };
      return formatedLoan;
    }),

  generatePayment: protectedProcedure
    .input(
      z.object({ loanId: z.string(), transaction: z.enum(PaymentTypeArray) }),
    )
    .mutation(async ({ ctx, input }) => {
      const [loan] = await ctx.db
        .select()
        .from(loans)
        // .innerJoin(payments, eq(loans.id, payments.loanId))
        .where(eq(loans.id, input.loanId)); // Use the input (id) to filter the record
      if (!loan)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Préstamo no encontrado",
        });

      const paymentsList = await ctx.db
        .select()
        .from(payments)
        .where(eq(payments.loanId, loan.id));
      const amount = new Decimal(loan.amount);
      const interest = new Decimal(loan.interestRate!).div(100);
      const paymentAmount = interest.mul(amount);

      console.log({
        ...loan,
        payments: paymentsList,
        amount,
        interest,
        paymentAmount,
      });

      const data = {
        loanId: input.loanId,
        paymentType: input.transaction,
        amount: paymentAmount.toString(),
      } as PaymentsCreateInput;

      await ctx.db.insert(payments).values(data);
    }),
});
