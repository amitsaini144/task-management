"use client";

import { TaskTable } from "@/components/task-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { taskColumns } from "@/action/task";

const fetchProjects = async (projectId: string) => {
    if (!projectId) return [];

    try {
        const response = await axios.get(`/api/task?projectId=${projectId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching projects:", error);
    }
}

export default function Tasks() {

    const params = useParams<{ projectId: string }>();
    const projectId = params?.projectId;

    const { data, isLoading} = useQuery({
        queryKey: ['tasks', projectId],
        queryFn: () => fetchProjects(projectId),
        staleTime: 1000 * 60 * 1,
    });

    return (
        <div className="flex flex-col min-h-screen ">
            <div className="flex px-4 pt-4">
                <h1>Tasks</h1>
            </div>
            <div className="flex flex-col gap-4 p-4">
                <TaskTable data={data} columns={taskColumns} type="task" isLoading={isLoading} />
            </div>
        </div>
    )
}