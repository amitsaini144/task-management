CREATE TYPE "public"."status" AS ENUM('todo', 'in progress', 'completed');--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "status" "status";--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "due_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "status" "status";