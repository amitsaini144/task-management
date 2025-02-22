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