ALTER TABLE "finance-app_loans" ALTER COLUMN "amount" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "finance-app_loans" ADD COLUMN "winnings" numeric(10, 2) DEFAULT '0.00' NOT NULL;