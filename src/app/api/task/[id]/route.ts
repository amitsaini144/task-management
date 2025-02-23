import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { db } from "@/db/drizzle";
import { tasks } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    const { ...updatedfields } = await req.json();
    const { id: taskId } = await context.params;

    if (!taskId) {
        return NextResponse.json(
            { message: "Please provide TaskId" },
            { status: 400 }
        );
    }

    if (Object.keys(updatedfields).length === 0) {
        return NextResponse.json(
            { message: "No fields provided for update" },
            { status: 400 }
        );
    }

    try {
        const totalUpdateFields = {
            ...updatedfields,
            updatedAt: new Date().toISOString(),
        }

        await db.update(tasks).set(totalUpdateFields).where(eq(tasks.id, Number(taskId)));
        return NextResponse.json(
            { message: "Update successful" },
            { status: 200 }
        );
    }
    catch (error) {
        return NextResponse.json(
            { message: "Error in updating", error },
            { status: 500 }
        )
    }
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    const { id } = await context.params;

    if (!id) {
        return NextResponse.json(
            { message: "Please provide Task id" },
            { status: 400 }
        );
    }

    try {
        await db.delete(tasks).where(eq(tasks.id, Number(id)));
        return NextResponse.json(
            { message: "Task deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error in deleting task", error },
            { status: 500 }
        )
    }
}