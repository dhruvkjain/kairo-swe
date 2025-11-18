import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";
export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Missing fields." }, { status: 400 });
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                emailVerified: true,
                role: true,
            },
        });
    
        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 401 });
        }

        // Check if email is verified
        if (!user.emailVerified) {
            return NextResponse.json(
                { error: "Please verify your email before logging in." },
                { status: 403 }
            );
        }

        // Compare passwords
        if (!user.password || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
        }

        // Create session
        const sessionToken = randomBytes(32).toString("hex");
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

        await prisma.session.create({
            data: {
                sessionToken,
                userId: user.id,
                expires,
            },
        });

        const response = NextResponse.json({
            message: "Login successful.",
            redirect: `/profile/${user.id}`,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

        // Set cookie
        cookies().set("sessionToken", sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            expires,
            path: "/",
        });

        // Return success
        return response;
    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: error.message || "Something went wrong during login." },

            { status: 500 }
        );
    }
}
