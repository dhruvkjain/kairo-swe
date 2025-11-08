import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function DELETE(req: Request) {
  try {
    const currentUser = await requireAuth();

    const { userId, field, value } = await req.json();

    if (currentUser.id !== userId) {
      return NextResponse.json({ error: "Forbidden: user mismatch" }, { status: 403 });
    }

    if (!userId || field !== "linkedInLink") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const updatedApplicant = await prisma.applicant.update({
      where: { userId },
      data: { linkedInLink: value }, 
      select: { id: true, linkedInLink: true },
    });

    return NextResponse.json({
      message: "LinkedIn link removed successfully",
      applicant: updatedApplicant,
    });
  } catch (error: unknown) {
    console.error("Error removing LinkedIn link:", error);

    let message = "Internal Server Error";
    let status = 500;

    if (error instanceof Error) {
      message = error.message;
      if (message.includes("Unauthorized")) status = 401;
    }

    return NextResponse.json({ error: message }, { status });
  }
}