ALTER TABLE "tasks" ADD COLUMN "due_date" timestamp NOT NULL;--> statement-breakpoint
CREATE INDEX "task_project_id_index" ON "tasks" USING btree ("project_id");