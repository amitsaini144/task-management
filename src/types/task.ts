

export interface Task {
    id: string
    dueDate: Date
    priorityStatus: "low" | "medium" | "high"
    status: "pending" | "processing" | "success" | "failed"
    title: string
    description: string
}