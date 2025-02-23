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
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Project } from "@/types/project";

interface projectAddForm {
    userId: string;
    title: string;
    description: string;
    priorityStatus: string;
    dueDate?: Date;
    status: string;
}

interface projectEditForm {
    title: string;
    description: string;
    priorityStatus: string;
    dueDate?: Date;
    status: string;
}

export default function ProjectForm({ type, projectDetails }: { type: "add" | "edit", projectDetails?: Project }) {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [status, setStatus] = useState<string>("pending");
    const [priorityStatus, setPriorityStatus] = useState<string>("high");
    const [date, setDate] = useState<Date>();
    const [open, setOpen] = useState<boolean>(false);

    const queryClient = useQueryClient();
    const { data: session } = useSession();
    const user = session?.user;

    useEffect(() => {
        if (type === "edit" && projectDetails) {
            setTitle(projectDetails?.title);
            setDescription(projectDetails?.description);
            setPriorityStatus(projectDetails.priorityStatus);
            setDate(projectDetails.dueDate);
            setStatus(projectDetails.status);
        }
    }, [type, projectDetails])

    const addProjectMutation = useMutation({
        mutationFn: (newTask: projectAddForm) => axios.post("/api/project", newTask),
        onSuccess: () => {
            toast.success("Project added successfully");
            queryClient.invalidateQueries({ queryKey: ['projects', user?.id] });
            setTitle("");
            setDescription("");
            setPriorityStatus("high");
            setDate(new Date());
            setStatus("pending");
            setOpen(false);
        },
        onError: (error) => {
            console.error("Error adding task:", error);
        },
    })

    const editProjectMutation = useMutation({
        mutationFn: (newTask: projectEditForm) => axios.patch(`/api/project/${projectDetails?.id}`, newTask),
        onSuccess: () => {
            toast.success("Project edited successfully");
            queryClient.invalidateQueries({ queryKey: ['projects', user?.id] });
            setOpen(false);
        },
        onError: (error) => {
            console.error("Error editing task:", error);
        },
    })

    const handleAddProject = async () => {
        addProjectMutation.mutate({
            userId: user?.id,
            title,
            description,
            priorityStatus,
            dueDate: date,
            status,
        })
    }

    const handleEditProject = async () => {
        editProjectMutation.mutate({
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
                    <Button variant="outline">Project<PlusIcon /></Button>
                ) : (
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <Edit2Icon />
                    </Button>
                )}

            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{type === "add" ? "Add Project" : "Edit Project"}</DialogTitle>
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
                            onChange={(e) => setTitle(e.target.value)}
                            />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-left">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            value={description}
                            className="col-span-3 max-h-60 min-h-28"
                            onChange={(e) => setDescription(e.target.value)}
                            />
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
                                    <SelectItem value="pending">Pending</SelectItem>
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
                        onClick={type === "add" ? handleAddProject : handleEditProject}
                        disabled={addProjectMutation.isPending || editProjectMutation.isPending || !title || !description || !date}>
                        {type === "add" ?
                            (addProjectMutation.isPending ? "Adding..." : "Add")
                            :
                            (editProjectMutation.isPending ? "Saving..." : "Save")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}