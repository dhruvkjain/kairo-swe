import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Make sure this path matches your project structure

export async function GET(req: NextRequest) {
  try {
    // 1. Get the ID from query parameters safely
    const { searchParams } = new URL(req.url);
    const recruiterId = searchParams.get("id");

    if (!recruiterId) {
      return NextResponse.json(
        { error: "Recruiter ID is required" },
        { status: 400 }
      );
    }

    // 2. Find the Recruiter and select specific Company details
    const recruiterData = await prisma.recruiter.findUnique({
      where: {
        userId: recruiterId, // Assumes you are passing the 'Recruiter' table ID (UUID)
      },
      select: {
        // We only select the company relation here
        company: {
          select: {
            id: true,
            name: true,
            industry: true,
            website: true,
            overview: true,
            companySize: true,
            location: true,
            establishedYear: true,
          },
        },
      },
    });

    // 3. Check if the Recruiter exists
    if (!recruiterData) {
      return NextResponse.json(
        { error: "Recruiter not found" },
        { status: 404 }
      );
    }

    // 4. Check if the Recruiter is actually linked to a Company
    // In your schema, 'companyId' is optional (String?), so this check is vital.
    if (!recruiterData.company) {
      return NextResponse.json(
        { error: "No company profile associated with this recruiter account" },
        { status: 404 }
      );
    }

    // 5. Return the Company Data
    return NextResponse.json(recruiterData.company, { status: 200 });

  } catch (error) {
    console.error("Error fetching company data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}