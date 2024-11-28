ALTER TABLE "finance-app_loans" DROP CONSTRAINT "finance-app_loans_owner_id_finance-app_borrowers_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "finance-app_loans" ADD CONSTRAINT "finance-app_loans_owner_id_finance-app_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."finance-app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
