

export interface Task {
    id: string
    dueDate: Date
    priorityStatus: "low" | "medium" | "high"
    status: "pending" | "in progress" | "completed"
    title: string
    description: string
}