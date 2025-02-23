"use client";

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CalendarIcon, Edit2Icon, PlusIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import axios from "axios";
import { usePathname } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Task } from "@/types/task";

interface taskAddForm {
    projectId: string;
    title: string;
    description: string;
    priorityStatus: string;
    dueDate?: Date;
    status: string;
}

interface taskEditForm {
    title: string;
    description: string;
    priorityStatus: string;
    dueDate?: Date;
    status: string;
}

export default function TaskForm({ type, taskDetails }: { type: "add" | "edit", taskDetails?: Task }) {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [status, setStatus] = useState<string>("todo");
    const [priorityStatus, setPriorityStatus] = useState<string>("low");
    const [date, setDate] = useState<Date>();
    const [open, setOpen] = useState<boolean>(false);

    const queryClient = useQueryClient();
    const pathname = usePathname();
    const projectId = pathname.split("/")[2];

    useEffect(() => {
        if (type === "edit" && taskDetails) {
            setTitle(taskDetails?.title);
            setDescription(taskDetails?.description);
            setPriorityStatus(taskDetails.priorityStatus);
            setDate(taskDetails.dueDate);
            setStatus(taskDetails.status);
        }
    }, [type, taskDetails])

    const addTaskMutation = useMutation({
        mutationFn: (newTask: taskAddForm) => axios.post("/api/task", newTask),
        onSuccess: () => {
            toast.success("Task added successfully");
            queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
            setTitle("");
            setDescription("");
            setPriorityStatus("high");
            setDate(new Date());
            setStatus("todo");
            setOpen(false);
        },
        onError: (error) => {
            console.error("Error adding task:", error);
        },
    })

    const editTaskMutation = useMutation({
        mutationFn: (newTask: taskEditForm) => axios.patch(`/api/task/${taskDetails?.id}`, newTask),
        onSuccess: () => {
            toast.success("Task edited successfully");
            queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
            setOpen(false);
        },
        onError: (error) => {
            console.error("Error editing task:", error);
        },
    })


    const handleAddTask = async () => {
        addTaskMutation.mutate({
            projectId,
            title,
            description,
            priorityStatus,
            dueDate: date,
            status,
        })
    }

    const handleEditTask = async () => {
        editTaskMutation.mutate({
            title,
            description,
            priorityStatus,
            dueDate: date,
            status,
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {type === "add" ? (
                    <Button variant="outline">Task<PlusIcon /></Button>
                ) : (
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <Edit2Icon />
                    </Button>
                )}

            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{type === "add" ? "Add Task" : "Edit Task"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-left">
                            Title
                        </Label>
                        <Input
                            id="title"
                            value={title}
                            className="col-span-3"
                            onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-left">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            className="col-span-3 max-h-60"
                            onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-left">
                            Status
                        </Label>
                        <Select value={status} onValueChange={(value) => setStatus(value)}>
                            <SelectTrigger className="w-[277px]">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="todo">To Do</SelectItem>
                                    <SelectItem value="in progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="priorityStatus" className="text-left">
                            Priority
                        </Label>
                        <Select value={priorityStatus} onValueChange={(value) => setPriorityStatus(value)}>
                            <SelectTrigger className="w-[277px]">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dueDate" className="text-left">
                            Due Date
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-[240px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon />
                                    {date ? format(date, "yyyy-MM-dd") : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="submit"
                        onClick={type === "add" ? handleAddTask : handleEditTask}
                        disabled={addTaskMutation.isPending || !title || !description || !date}>
                        {type === "add" ?
                            (addTaskMutation.isPending ? "Adding..." : "Add")
                            :
                            (editTaskMutation.isPending ? "Saving..." : "Save")
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}