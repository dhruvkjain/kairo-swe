import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    console.log("Running login handler...");
    try {
        const { email, password, role } = await req.json();

        // Validate required fields
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // Validate role
        const validRoles = ["APPLICANT", "RECRUITER"];
        const normalizedRole = role?.toUpperCase();
        if (!validRoles.includes(normalizedRole)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (!existingUser) {
            return NextResponse.json({ error: "Invalid email" }, { status: 400 });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if (!isValidPassword) {
            return NextResponse.json({ error: "Invalid password" }, { status: 400 });
        }

        // Check role match (optional)
        if (existingUser.role.toUpperCase() !== normalizedRole) {
            return NextResponse.json(
                { error: "Role does not match this account" },
                { status: 400 }
            );
        }

        // Successful login
        return NextResponse.json(
            { success: true, message: "Login successful", user: { email, role: existingUser.role } },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: error.message || "Something went wrong" },
            { status: 500 }
        );
    }
}
