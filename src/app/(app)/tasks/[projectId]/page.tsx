"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton"
import TaskCard from "@/components/taskCard";
import { Task } from "@/types/task";
import TaskForm from "@/components/task-form";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const fetchProjects = async (projectId: string) => {
    if (!projectId) return [];

    try {
        const response = await axios.get(`/api/project/${projectId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching projects:", error);
    }
}

export default function Tasks() {
    const params = useParams<{ projectId: string }>();
    const projectId = params?.projectId;

    const { data, isLoading } = useQuery({
        queryKey: ['tasks', projectId],
        queryFn: () => fetchProjects(projectId),
        staleTime: 1000 * 60 * 1,
    });

    return (
        <motion.div
            initial={{ opacity: 0, x: "50vw", }}
            animate={{ opacity: 1, x: 0, }}
            transition={{
                duration: 0.5,
                ease: "easeInOut"
            }}

            className="flex flex-col min-h-screen ">
            <div className="flex p-4">
                <h1 className="text-2xl font-bold">Tasks</h1>
            </div>
            <div className="flex flex-col p-4">
                <div className="flex flex-col p-4 gap-4 border rounded-lg bg-sidebar shadow-[0_1px_1px_rgba(0,0,0,0.05),0_4px_6px_rgba(34,42,53,0.04),0_24px_68px_rgba(47,48,55,0.05),0_2px_3px_rgba(0,0,0,0.04)]">
                    <div className="flex justify-between">
                        {isLoading ? <Skeleton className="w-[150px] h-[16px] rounded-full" /> : <p>{data?.title}</p>}
                        {isLoading ? <Skeleton className="w-[100px] h-[14px] rounded-full" /> : <p className="text-sm">{data?.dueDate.split(" ")[0]}</p>}
                    </div>
                    {isLoading ? <Skeleton className="w-full h-[14px] rounded-full" /> : <p className="text-sm text-neutral-400">{data?.description}</p>}
                </div>
            </div>
            <div className="flex justify-between gap-4 p-4">
                <Input placeholder="Search..." className="max-w-sm" />
                <TaskForm type="add" />
            </div>
            {isLoading ?
                <div className="flex flex-col gap-4 p-4">
                    <Skeleton className="w-full h-[130px] rounded-lg" />
                    <Skeleton className="w-full h-[130px] rounded-lg" />
                    <Skeleton className="w-full h-[130px] rounded-lg" />
                </div>
                :
                data?.tasks.length ? (
                    <div className="flex flex-col gap-4 p-4" >
                        {data?.tasks.map((task: Task) => {
                            return <TaskCard key={task.id} task={task} />
                        })}
                    </div>
                ) : (
                    <div className="flex justify-center p-4">
                        <p>NO TASKS</p>
                    </div>
                )}

        </motion.div>
    )
}