DO $$ BEGIN
 CREATE TYPE "public"."finance-app_roles" AS ENUM('NOT_VERIFIED', 'ADMIN', 'EDITOR', 'OPERATOR', 'READER', 'VIEWER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "finance-app_user" ADD COLUMN "roles" "finance-app_roles" DEFAULT 'NOT_VERIFIED';