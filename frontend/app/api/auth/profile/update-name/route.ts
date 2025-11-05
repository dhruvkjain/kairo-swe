import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, name } = await req.json();

    if (!userId || !name || !String(name).trim()) {
      return NextResponse.json(
        { error: "userId and name are required" },
        { status: 400 }
      );
    }

    // Authenticate session
    const sessionToken = cookies().get("sessionToken")?.value;
    if (!sessionToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await prisma.session.findUnique({ where: { sessionToken } });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Only owner can edit their name
    if (session.userId !== userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name: String(name).trim() },
    });

    return NextResponse.json({
      message: "Name updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Error updating name:", error);
    return NextResponse.json(
      { error: "Failed to update name" },
      { status: 500 }
    );
  }
}
