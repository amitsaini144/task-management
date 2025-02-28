"use client";

import DeleteDialog from "./delete-dialog"
import { Task } from "@/types/task";
import TaskForm from "./task-form";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
    "completed": "bg-success",
    "in progress": "dark:bg-ongoing bg-ongoing2",
    "pending": "bg-destructive"
};

export default function TaskCard({ task }: { task: Task }) {
    const { id, title, description, status, priorityStatus, dueDate } = task;

    const rawDate: string = new Date(dueDate).toLocaleDateString();
    const formattedDate = rawDate.split(" ")[0];
    const colorClass = statusColors[status] || "bg-gray-500";

    return (
        <div className="flex flex-col border rounded-lg p-4 shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)] bg-sidebar">
            <motion.div
                initial={{ opacity: 0, scale: 0.98, }}
                animate={{ opacity: 1, scale: 1,  }}
                transition={{
                    duration: 0.5,
                    ease: "easeInOut"
                }}>
                <div className="flex justify-between">
                    <p>{title}</p>
                    <div className="flex justify-center items-center">
                        <TaskForm type="edit" taskDetails={task} />
                        <DeleteDialog type="task" id={id} />
                    </div>

                </div>
                <div className="py-1">
                    <p className="text-neutral-400">{description}</p>

                </div>
                <div className="flex gap-4 pt-2">
                    <button className={`py-0.5 px-2 text-white rounded-lg capitalize text-sm ${colorClass}`}>{status}</button>
                    <p className="capitalize">{priorityStatus}</p>
                    <p>{formattedDate}</p>
                </div>
            </motion.div>
        </div>
    )
}