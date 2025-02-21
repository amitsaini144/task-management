import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
        return NextResponse.json({
            message: "Please provide all the fields",
            status: 400
        });
    }

    try {
        const userExisted = await db.select().from(users).where(or(eq(users.email, email), eq(users.username, username)));
        if (userExisted.length > 0) {

            const isEmailTaken = userExisted.some((user) => user.email === email);

            return NextResponse.json({ 
                status: 400,
                message: isEmailTaken ? "Email already exists" : "Username already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.insert(users).values({ username, email, password: hashedPassword });

        return NextResponse.json({
            message: "User created successfully",
            status: 200
        });
    } catch (error) {
        return NextResponse.json({
            message: "error", error: error,
            status: 500
        });
    }
}

export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
        return NextResponse.json({ message: "Please provide email", status: 400 });
    }

    try {
        const user = await db.select().from(users).where(eq(users.email, email));
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ message: "error", error: error }, { status: 500 });
    }
}