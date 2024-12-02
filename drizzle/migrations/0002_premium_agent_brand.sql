ALTER TABLE "finance-app_borrowers" ADD COLUMN "created_by" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "finance-app_borrowers" ADD CONSTRAINT "finance-app_borrowers_created_by_finance-app_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."finance-app_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
