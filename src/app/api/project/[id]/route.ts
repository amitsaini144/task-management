import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { projects, tasks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";


export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const projectId = id;
    const userId = session.user.id;

    if (!userId) {
        return NextResponse.json({ message: "Please provide userId" }, { status: 400 });
    }

    try {
        const projectTasks = ((await db.select().from(tasks).where(eq(tasks.projectId, Number(projectId))).orderBy(tasks.createdAt)));
        const projectDetails = await db.select().from(projects).where(eq(projects.id, Number(projectId)));

        return NextResponse.json({
            ...projectDetails[0],
            tasks: projectTasks.reverse(),

        });
    } catch (error) {
        return NextResponse.json({ message: "error", error: error }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }

    const { ...updateFields } = await req.json();
    const { id: projectId } = await context.params;

    if (!projectId) {
        return NextResponse.json(
            { message: "Please provide productId" },
            { status: 400 }
        );
    }

    if (Object.keys(updateFields).length === 0) {
        return NextResponse.json(
            { message: "No fields provided for update" },
            { status: 400 }
        );
    }

    try {
        const totalUpdateFields = {
            ...updateFields,
            updatedAt: new Date().toISOString(),
        }

        await db.update(projects).set(totalUpdateFields).where(eq(projects.id, Number(projectId)));
        return NextResponse.json(
            { message: "Update successful" },
            { status: 200 }
        );
    }
    catch (error) {
        return NextResponse.json(
            { message: "Error in updating", error },
            { status: 500 }
        );
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
            { message: "Please provide Project id" },
            { status: 400 }
        );
    }

    try {

        const projectTasks = await db.select().from(tasks).where(eq(tasks.projectId, Number(id)))
        if (projectTasks.length > 0) {
            return NextResponse.json(
                { message: "Project with tasks cannot be deleted" },
                { status: 400 }
            );
        }

        await db.delete(projects).where(eq(projects.id, Number(id)));
        return NextResponse.json(
            { message: "Project deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Error in deleting project", error },
            { status: 500 }
        )
    }
}