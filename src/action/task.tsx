import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Task } from '@/types/task'
import TaskForm from "@/components/task-form"
import DeleteDialog from "@/components/delete-dialog"

const statusColors: Record<string, string> = {
    "completed": "bg-success",
    "in progress": "dark:bg-ongoing bg-ongoing2",
    "pending": "bg-destructive"
};

export const taskColumns: ColumnDef<Task>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                    className="p-0"
                >
                    Task
                    <ArrowUpDown />
                </Button>
            )
        },
        cell: ({ row }) => <div className="lowercase">{row.getValue("title")}</div>,
    },
    {
        accessorKey: "dueDate",
        header: "Due Date",
        cell: ({ row }) => {
            const rawDate: string = row.getValue("dueDate");
            const formattedDate = rawDate.split(" ")[0];
            return <div className="capitalize">{formattedDate}</div>;
        },
    },
    {
        accessorKey: "priorityStatus",
        header: "Priority",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("priorityStatus")}</div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status: string = row.getValue("status") || "";
            const colorClass = statusColors[status] || "bg-gray-500";
            return (
                <button className={`py-1 px-2 text-white rounded-md capitalize ${colorClass}`}>{status}</button>
            )
        },
    },
    {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
            const taskDetails = row.original;
            return (
                <div className="h-8 w-8 p-0 flex gap-4" onClick={(e) => {
                    e.stopPropagation();
                }}>
                    <TaskForm type="edit" taskDetails={taskDetails} />
                    <DeleteDialog type="task" id={taskDetails.id} />
                </div>
            )
        },
    },
]