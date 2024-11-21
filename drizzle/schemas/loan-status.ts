import { pgEnum } from "drizzle-orm/pg-core";

export const loanStatuses = pgEnum("finance-app_loan_statuses", [
  "APPROVED", // Loan has been approved
  "DISBURSED", // Funds have been disbursed to the borrower
  "ACTIVE", // Loan is currently active and being repaid
  "COMPLETED", // Loan has been fully repaid
  "DEFAULTED", // Loan defaulted due to non-payment
  "CANCELED", // Loan application or approval was canceled
]);

export type LoanStatus = (typeof loanStatuses.enumValues)[number];
export const loanStatusArray = loanStatuses.enumValues;
