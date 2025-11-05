// app/profile/github/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * PUT /profile/github
 * Body: { userId: string, githubLink: string }
 * Updates the applicant's GitHub link
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, githubLink } = body;

    // ✅ Validate inputs
    if (!userId || !githubLink) {
      return NextResponse.json(
        { error: "Missing userId or githubLink" },
        { status: 400 }
      );
    }

    // ✅ Check if applicant exists
    const applicant = await prisma.applicant.findUnique({
      where: { userId },
    });

    if (!applicant) {
      return NextResponse.json(
        { error: "Applicant not found" },
        { status: 404 }
      );
    }

    // ✅ Update GitHub link
    const updatedApplicant = await prisma.applicant.update({
      where: { userId },
      data: { githubLink },
    });

    return NextResponse.json({
      message: "GitHub link updated successfully",
      githubLink: updatedApplicant.githubLink,
    });
  } catch (error) {
    console.error("Error updating GitHub link:", error);
    return NextResponse.json(
      { error: "Failed to update GitHub link" },
      { status: 500 }
    );
  }
}


