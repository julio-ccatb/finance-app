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
        payments: loan.map((item) => item.payments),
      };
      return formatedLoan;
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
        .where(eq(loans.id, input.loanId)); // Use the input (id) to filter the record

      if (!loan) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Préstamo no encontrado",
        });
      }

      // Convert loan data to Decimal for accurate calculations
      const loanAmount = new Decimal(loan.amount);
      const loanBalance = new Decimal(loan.balance); // Total paid so far
      let paymentAmount: Decimal;

      // Use switch-case to determine the payment amount
      switch (input.transaction) {
        case "PAYMENT": {
          if (!input.amount) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "El monto es requerido para el tipo de transacción 'PAYMENT'",
            });
          }
          const inputAmount = new Decimal(input.amount);
          paymentAmount = inputAmount;

          // Update balance (add payment to balance)
          const newBalance = loanBalance.plus(paymentAmount);
          await ctx.db
            .update(loans)
            .set({ balance: newBalance.toString() })
            .where(eq(loans.id, input.loanId));
          break;
        }
        case "INTREST": {
          // Interest is calculated on the remaining loan amount
          const remainingAmount = loanAmount.minus(loanBalance);
          const interest = new Decimal(loan.interestRate!).div(100);
          paymentAmount = interest.mul(remainingAmount);
          break;
        }
        case "SURCHARGE": {
          if (!input.amount) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message:
                "El monto es requerido para el tipo de transacción 'SURCHARGE'",
            });
          }
          const inputAmount = new Decimal(input.amount);
          paymentAmount = inputAmount;

          // Update balance (add surcharge to balance)
          const newBalance = loanBalance.plus(paymentAmount);
          await ctx.db
            .update(loans)
            .set({ balance: newBalance.toString() })
            .where(eq(loans.id, input.loanId));
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
});
