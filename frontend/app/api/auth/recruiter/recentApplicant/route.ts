import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const recruitersId = searchParams.get("recruiterId");

    if (!recruitersId) {
      return NextResponse.json(
        { error: "Missing recruiterId" },
        { status: 400 }
      );
    }
    const recruiter = await prisma.recruiter.findUnique({
      where: {userId :recruitersId},
    })
    if (!recruiter) {
        return NextResponse.json(
            { error: "Recruiter not found" },
            { status: 404 }
        );
    }
    const recruiterId = recruiter.id

    // Step 1: Get all internships posted by this recruiter
    const internships = await prisma.internship.findMany({
      where: { recruiterId },
      select: { id: true },
    });

    // If no internships, return empty list
    if (internships.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Convert to array of ids
    const internshipIds = internships.map((i) => i.id);

    // Step 2: Fetch all applications linked to these internship IDs
    const applications = await prisma.internshipApplication.findMany({
      where: {
        internshipId: {
          in: internshipIds,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
