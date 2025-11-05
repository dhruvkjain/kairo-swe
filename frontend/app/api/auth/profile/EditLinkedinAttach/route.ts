// app/profile/linkedin/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * PUT /profile/linkedin
 * Body: { userId: string, linkedInLink: string }
 * Updates the applicant's LinkedIn link
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, linkedInLink } = body;

    // ✅ Validate inputs
    if (!userId || !linkedInLink) {
      return NextResponse.json(
        { error: "Missing userId or linkedInLink" },
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

    // ✅ Update LinkedIn link
    const updatedApplicant = await prisma.applicant.update({
      where: { userId },
      data: { linkedInLink },
    });

    return NextResponse.json({
      message: "LinkedIn link updated successfully",
      linkedInLink: updatedApplicant.linkedInLink,
    });
  } catch (error) {
    console.error("Error updating LinkedIn link:", error);
    return NextResponse.json(
      { error: "Failed to update LinkedIn link" },
      { status: 500 }
    );
  }
}
