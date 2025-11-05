import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const { userId, name } = await req.json();

    if (!userId || !name || !String(name).trim()) {
      return NextResponse.json(
        { error: "userId and name are required" },
        { status: 400 }
      );
    }

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
