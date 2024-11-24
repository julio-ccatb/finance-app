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
import { payments, type PaymentsCreateInput } from "drizzle/schemas/payments";
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
        payments: loan.map((item) => item.payments).filter(Boolean), // Keep only truthy (non-null) payment objects
      };

      return {
        ...formatedLoan,
        payments: formatedLoan.payments.length ? formatedLoan.payments : [], // Ensure payments is an empty array if none exist
      };
    }),

  generatePayment: protectedProcedure
    .input(
      z.object({
        loanId: z.string(),
        transaction: z.enum(PaymentTypeArray),
        amount: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [loan] = await ctx.db
        .select()
        .from(loans)
        .where(eq(loans.id, input.loanId));

      if (!loan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Préstamo no encontrado",
        });
      }

      let paymentAmount: Decimal;

      switch (input.transaction) {
        case "PAYMENT":
        case "SURCHARGE": {
          if (!input.amount) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: `El monto es requerido para el tipo de transacción '${input.transaction}'`,
            });
          }
          paymentAmount = new Decimal(input.amount);
          break;
        }
        case "INTREST": {
          const loanAmount = new Decimal(loan.amount);
          const loanBalance = new Decimal(loan.balance);
          const remainingAmount = loanAmount.minus(loanBalance);
          const interest = new Decimal(loan.interestRate!).div(100);
          paymentAmount = interest.mul(remainingAmount);
          break;
        }
        default: {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Tipo de transacción no válido",
          });
        }
      }

      const data = {
        loanId: input.loanId,
        paymentType: input.transaction,
        amount: paymentAmount.toString(),
      } as PaymentsCreateInput;

      await ctx.db.insert(payments).values(data);
    }),
  applyPayment: protectedProcedure
    .input(
      z.object({
        loanId: z.string(),
        paymentId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Fetch loan details
      const [loan] = await ctx.db
        .select()
        .from(loans)
        .where(eq(loans.id, input.loanId));

      if (!loan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Préstamo no encontrado",
        });
      }

      // Fetch payment details
      const [payment] = await ctx.db
        .select()
        .from(payments)
        .where(eq(payments.id, input.paymentId));

      if (!payment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Pago no encontrado",
        });
      }

      if (payment.status === "COMPLETED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "El pago ya ha sido aplicado",
        });
      }

      // Get the current loan balance
      const loanBalance = new Decimal(loan.balance);
      const paymentAmount = new Decimal(payment.amount);

      // Update the loan balance only if the payment type is NOT "INTEREST"
      let newBalance = loanBalance;
      if (payment.paymentType !== "INTREST") {
        newBalance = loanBalance.plus(paymentAmount);
      }

      // Update loan balance and status
      await ctx.db
        .update(loans)
        .set({
          balance: newBalance.toString(),
          status: newBalance.gte(loan.amount) ? "COMPLETED" : loan.status,
        })
        .where(eq(loans.id, input.loanId));

      // Update payment status to COMPLETED
      await ctx.db
        .update(payments)
        .set({ status: "COMPLETED" })
        .where(eq(payments.id, input.paymentId));
    }),
});
