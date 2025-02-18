

export interface Task {
    id: string
    dueDate: string
    priority: "low" | "medium" | "high"
    status: "pending" | "processing" | "success" | "failed"
    title: string
}