"use client";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { TrashIcon } from "lucide-react"
import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";


export default function DeleteDialog({ type, id }: { type: "project" | "task", id: string }) {
    const [open, setOpen] = useState<boolean>(false);

    const queryClient = useQueryClient();
    const pathname = usePathname();
    const projectId = pathname.split("/")[2];
    const { data: session } = useSession();
    const user = session?.user;

    const deleteProjectMutation = useMutation({
        mutationFn: () => axios.delete(`/api/project/${id}`),
        onSuccess: () => {
            toast.success("Project deleted successfully");
            queryClient.invalidateQueries({ queryKey: ['projects', user?.id] });
            setOpen(false);
        },
        onError: (error) => {
            const axiosError = error as AxiosError<{ message?: string; error?: string }>;

            if (axiosError.response?.status === 400) {
                toast.error("Project with tasks cannot be deleted");
                setOpen(false);
                return;
            }

            const errorMessage = axiosError.response?.data?.message || "Error deleting project";
            toast.error(errorMessage);

            console.error("Error deleting project:", axiosError.response?.data || axiosError.message);
            setOpen(false);
        },
    })

    const deleteTaskMutation = useMutation({
        mutationFn: () => axios.delete(`/api/task/${id}`),
        onSuccess: () => {
            toast.success("Task deleted successfully");
            queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
            setOpen(false);
        },
        onError: (error) => {
            console.error("Error deleting task:", error);
        },
    })

    const handleDeleteProject = async () => {
        deleteProjectMutation.mutate();
    }

    const handleDeleteTask = async () => {
        deleteTaskMutation.mutate();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <TrashIcon className="text-destructive" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{type === "project" ? "Delete Project" : "Delete Task"}</DialogTitle>
                </DialogHeader>
                <div className="grid py-4">
                    <p>Are you sure you want to delete this {type === "project" ? "project" : "task"}?</p>
                </div>
                <DialogFooter>
                    <Button
                        variant={"destructive"}
                        type="submit"
                        onClick={type === "project" ? handleDeleteProject : handleDeleteTask}
                        disabled={deleteProjectMutation.isPending || deleteTaskMutation.isPending}>
                        {type === "project" ?
                            (deleteProjectMutation.isPending ? "Deleting..." : "Continue")
                            :
                            (deleteTaskMutation.isPending ? "Deleting..." : "Continue")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}