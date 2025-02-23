ALTER TABLE "public"."projects" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "public"."tasks" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."status";--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('pending', 'in progress', 'completed');--> statement-breakpoint
ALTER TABLE "public"."projects" ALTER COLUMN "status" SET DATA TYPE "public"."status" USING "status"::"public"."status";--> statement-breakpoint
ALTER TABLE "public"."tasks" ALTER COLUMN "status" SET DATA TYPE "public"."status" USING "status"::"public"."status";