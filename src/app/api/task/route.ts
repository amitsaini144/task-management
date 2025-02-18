import { db } from "@/db/drizzle";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();

    const requiredFields = ["projectId", "title", "description", "priorityStatus", "dueDate", "status"];

    const missingFields = requiredFields.filter( (field) => !body[field] )

    if (missingFields.length > 0) {
        return NextResponse.json(
            { message: "Please provide all the fields: " + missingFields.join(", ") },
            { status: 400 }
        );
    }

    try {
        await db.insert(tasks).values(body);
        return NextResponse.json({
            message: "success",
            success: 200,
        })
    } catch (error) {
        return NextResponse.json(
            { message: "error", error: error },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    const projectId = req.nextUrl.searchParams.get("projectId");

    if (!projectId) {
        return NextResponse.json({ message: "Please provide projectId", status: 400 });
    }

    try {
        const task = (await db.select().from(tasks).where(eq(tasks.projectId, Number(projectId)))).reverse();
        return NextResponse.json(task);
    } catch (error) {
        return NextResponse.json({ message: "error", error: error }, { status: 500 });
    }
}