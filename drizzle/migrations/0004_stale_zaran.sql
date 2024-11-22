ALTER TYPE "payment_statuses" ADD VALUE 'PAYMENT';--> statement-breakpoint
ALTER TYPE "payment_statuses" ADD VALUE 'INTREST';--> statement-breakpoint
ALTER TYPE "payment_statuses" ADD VALUE 'SURCHARGE';--> statement-breakpoint
ALTER TABLE "finance-app_payments" ADD COLUMN "payment_type" "payment_statuses" DEFAULT 'INTREST' NOT NULL;