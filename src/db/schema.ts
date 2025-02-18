
import { pgTable, serial, timestamp, pgEnum, varchar, integer, index } from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

export const users = pgTable("users", {
    id: serial().primaryKey(),
    username: varchar("username", { length: 100 }).notNull().unique(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    password: varchar("password", { length: 100 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
    projects: many(projects),
}));

export const priorityStatusEnum = pgEnum('priority_status', ['low', 'medium', 'high']);
export const statusEnum = pgEnum('status', ['todo', 'in progress', 'completed']);

export const projects = pgTable("projects", {
    id: serial().primaryKey(),
    userId: integer("user_id").notNull().references(() => users.id),
    title: varchar("title", { length: 255 }).notNull().unique(),
    description: varchar("description", { length: 500 }).notNull(),
    status: statusEnum(),
    priorityStatus: priorityStatusEnum(),
    dueDate: timestamp("due_date", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
},
    (table) => [
        index("project_priority_index").on(table.priorityStatus),
        index("project_title_index").on(table.title),
        index("project_user_id_index").on(table.userId),
    ]
);

export const projectsRelations = relations(projects, ({ many }) => ({
    tasks: many(tasks),
}));

export const tasks = pgTable("tasks", {
    id: serial().primaryKey(),
    projectId: integer("project_id").notNull().references(() => projects.id),
    title: varchar("title", { length: 255 }).notNull(),
    description: varchar("description", { length: 500 }).notNull(),
    status: statusEnum(),
    priorityStatus: priorityStatusEnum(),
    dueDate: timestamp("due_date", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
},
    (table) => [
        index("task_priority_index").on(table.priorityStatus),
        index("task_title_index").on(table.title),
        index("task_project_id_index").on(table.projectId),
    ]
)