"use client"

import { DataTable } from "@/components/Project-table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { projectColumns } from "@/action/project";


export default function Dashboard() {
    const { data, isLoading } = useQuery({
        queryKey: ['projects'],
        queryFn: () => fetchProjects(),
        staleTime: 1000 * 60 * 1,
    });

    const fetchProjects = async () => {
        try {
            const response = await axios.get("/api/project?userId=2");
            return response.data;
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    }

    return (
        <div className="flex flex-col min-h-screen ">
            <div className="flex px-4 pt-4">
                <h1>Projects</h1>
            </div>
            <div className="flex flex-col gap-4 p-4">
                <DataTable data={data} columns={projectColumns} type="project" isLoading={isLoading} />
            </div>
        </div>
    )
}