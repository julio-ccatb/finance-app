DO $$ BEGIN
 CREATE TYPE "public"."payment_statuses" AS ENUM('PENDING', 'COMPLETED', 'EXPIRED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "finance-app_payments" ADD COLUMN "status" "payment_statuses" DEFAULT 'PENDING' NOT NULL;