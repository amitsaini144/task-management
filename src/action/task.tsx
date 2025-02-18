"use client"

import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Task } from '@/types/task'
import TaskForm from "@/components/task-form"

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
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("status")}</div>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: () => {

            return (
                <div className="h-8 w-8 p-0" onClick={(e) => {
                    e.stopPropagation();
                    console.log("Edit");
                }}>
                    <TaskForm type="edit" />
                </div>
            )
        },
    },
]