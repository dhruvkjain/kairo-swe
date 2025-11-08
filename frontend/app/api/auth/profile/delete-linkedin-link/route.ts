import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function DELETE(req: Request) {
  try {
    const currentUser = await requireAuth();
    const { userId, field, value } = await req.json();

    if (currentUser.id !== userId)
      return NextResponse.json({ error: "Forbidden: user mismatch" }, { status: 403 });

    if (!userId || field !== "linkedInLink")
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const updatedApplicant = await prisma.applicant.update({
      where: { userId },
      data: { linkedInLink: value },
      select: { id: true, linkedInLink: true },
    });

    return NextResponse.json({
      message: "LinkedIn link removed successfully",
      applicant: updatedApplicant,
    });
  } catch (error) {
    console.error("Error removing LinkedIn link:", error);
    let status = 500;
    let message = "Internal Server Error";
    if (error instanceof Error && error.message.includes("Unauthorized")) status = 401;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
