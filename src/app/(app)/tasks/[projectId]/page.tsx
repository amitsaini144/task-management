"use client";

import { TaskTable } from "@/components/task-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { taskColumns } from "@/action/task";
import { Skeleton } from "@/components/ui/skeleton"

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
        <div className="flex flex-col min-h-screen ">
            <div className="flex p-4">
                <h1 className="text-2xl font-bold">Tasks</h1>
            </div>
            <div className="flex flex-col p-4">
                <div className="flex flex-col p-4 gap-4 border rounded-lg">
                    <div className="flex justify-between">
                        {isLoading ? <Skeleton className="w-[150px] h-[16px] rounded-full" /> : <p>{data?.title}</p>}
                        {isLoading ? <Skeleton className="w-[100px] h-[14px] rounded-full" /> : <p className="text-sm">{data?.dueDate.split(" ")[0]}</p>}
                    </div>
                    {isLoading ? <Skeleton className="w-full h-[14px] rounded-full" /> : <p className="text-sm text-[#717171]">{data?.description}</p>}
                </div>
            </div>
            <div className="flex flex-col gap-4 p-4">
                <TaskTable data={data?.tasks ?? []} columns={taskColumns} type="task" isLoading={isLoading} />
            </div>
        </div>
    )
}