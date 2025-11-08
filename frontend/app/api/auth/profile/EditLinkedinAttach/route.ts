// app/profile/linkedin/route.ts
// ----------------------------------------------------
// API route for updating applicant's LinkedIn profile
// ----------------------------------------------------

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// create prisma instance (used for DB operations)
const prisma = new PrismaClient();

/**
 * PUT /profile/linkedin
 * ----------------------------------------------------
 * Request Body: { userId: string, linkedInLink: string }
 * Purpose: Updates an applicant's LinkedIn link field
 * ----------------------------------------------------
 */
export async function PUT(request: Request) {
  try {
    // get data from request body
    const body = await request.json();
    const { userId, linkedInLink } = body;

    // quick validation check
    if (!userId || !linkedInLink) {
      // return early if data is missing
      return NextResponse.json(
        { error: "Missing userId or linkedInLink" },
        { status: 400 }
      );
    }

    // find applicant by userId
    const applicant = await prisma.applicant.findUnique({
      where: { userId },
    });

    // handle missing applicant case
    if (!applicant) {
      return NextResponse.json(
        { error: "Applicant not found" },
        { status: 404 }
      );
    }

    // perform update operation
    const updatedApplicant = await prisma.applicant.update({
      where: { userId },
      data: { linkedInLink },
    });

    // return success response
    return NextResponse.json({
      message: "LinkedIn link updated successfully",
      linkedInLink: updatedApplicant.linkedInLink,
    });
  } catch (error) {
    // log error to server console for debugging
    console.error("Error updating LinkedIn link:", error);

    // generic 500 response
    return NextResponse.json(
      { error: "Failed to update LinkedIn link" },
      { status: 500 }
    );
  }
}

// ----------------------------------------------------
// Notes:
// - Make sure Prisma model `Applicant` has `linkedInLink` field.
// - Add proper DB error handling if needed.
// - Could later extend to validate LinkedIn URL format.
// ----------------------------------------------------
