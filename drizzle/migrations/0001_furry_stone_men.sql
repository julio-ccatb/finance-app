ALTER TABLE "finance-app_loans" ALTER COLUMN "amount" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "finance-app_loans" ADD COLUMN "surcharge" numeric(10, 2) DEFAULT '0.00' NOT NULL;