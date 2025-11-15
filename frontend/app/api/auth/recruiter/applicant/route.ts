import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // <-- adjust if needed

// GET /api/auth/recruiter/applicant?recruiterId=123
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const internshipId = searchParams.get("internshipId");

    if (!internshipId) {
      return NextResponse.json(
        { error: "Missing internshipId" },
        { status: 400 }
      );
    }

    // Fetch applicants linked to recruiter's internships
    const applicants = await prisma.internshipApplication.findMany({
      where: {internshipId},
    });

    return NextResponse.json(applicants, { status: 200 });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
