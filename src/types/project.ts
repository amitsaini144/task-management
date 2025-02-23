

export interface Project {
    id: string
    dueDate: Date
    priorityStatus: "low" | "medium" | "high"
    status: "todo" | "in progress" | "completed"
    title: string
    description: string
}