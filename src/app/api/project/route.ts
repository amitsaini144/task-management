import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
    const { userId, title, description, priorityStatus, dueDate, status } = await req.json();

    if (!userId || !title || !description || !priorityStatus || !dueDate || !status) {
        return NextResponse.json(
            { message: "Please provide all the fields" },
            { status: 400 }
        );
    }

    try {
        await db.insert(projects).values({ userId, title, description, priorityStatus, dueDate, status });
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
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = req.nextUrl.searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ message: "Please provide userId" }, { status: 400 });
    }

    try {
        const project = ((await db.select().from(projects).where(eq(projects.userId, Number(userId))).orderBy(projects.createdAt)).reverse());
        return NextResponse.json(project);
    } catch (error) {
        return NextResponse.json({ message: "error", error: error }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const { projectId, ...updateFields } = await req.json();

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
        return NextResponse.json({
            message: "Update successful",
            success: 200,
        })

    } catch (error) {
        return NextResponse.json(
            { message: "Error in updating", error: error },
            { status: 500 }
        );
    }
}