"use client";

import { useState } from "react"
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
import { CalendarIcon, Edit2Icon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import axios from "axios";
import { useSession } from "next-auth/react";

export default function ProjectForm({ type }: { type: "add" | "edit" }) {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [status, setStatus] = useState<string>("todo");
    const [priorityStatus, setPriorityStatus] = useState<string>("low");
    const [date, setDate] = useState<Date>();

    const { data: session } = useSession();
    const user = session?.user;

    const handleSubmit = async () => {
        try {
            const response = await axios.post("/api/project", {
                userId: user?.id,
                title,
                description,
                priorityStatus,
                dueDate: date,
                status,
            });

            console.log(response);
        } catch (error) {
            console.error("Error submitting task:", error);
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {type === "add" ? (
                    <Button variant="outline">Add Project</Button>
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
                            className="col-span-3"
                            onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-left">
                            Description
                        </Label>
                        <Textarea
                            id="description"
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
                    <Button type="submit" onClick={handleSubmit}>{type === "add" ? "Add" : "Save"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}