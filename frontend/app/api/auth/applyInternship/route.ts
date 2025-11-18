
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST: Apply to Internship (duplicate of /api/auth/findInternship POST logic)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { internshipId, userId, coverLetter, resumeUrl } = body;

    if (!internshipId || !userId) {
      return NextResponse.json(
        { error: "internshipId and userId are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true, gender: true }
    });

    if (!user) {
        return NextResponse.json(
            { error: "Applicant user not found" },
            { status: 404 }
        );
    }

    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
    });

    if (!internship) {
      return NextResponse.json(
        { error: "Internship not found" },
        { status: 404 }
      );
    }

    const existingApp = await prisma.internshipApplication.findUnique({
      where: {
        internshipId_applicantId: {
          internshipId,
          applicantId: userId,
        },
      },
    });

    if (existingApp) {
      return NextResponse.json(
        { message: "You have already applied for this internship" },
        { status: 409 }
      );
    }

    const application = await prisma.internshipApplication.create({
      data: {
        internshipId,
        applicantId: userId,
        coverLetter,
        resumeUrl,
        gender: user.gender
      },
    });

    // Call FastAPI resume parser (if available)
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/parse-resume",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: resumeUrl }),
        }
      );

      const parsedData = await response.json();
      // Save parsed data into DB column 'resumeData' (modify as per your Prisma schema)
      await prisma.internshipApplication.update({
        where: { id: application.id },
        data: { resumeData: parsedData },
      });

      // Update internship application count
      await prisma.internship.update({
        where: { id: internshipId },
        data: { applicationsCount: { increment: 1 } },
      });

      return NextResponse.json(
        {
          message: "Application submitted and resume parsed successfully",
          application,
          resumeData: parsedData,
        },
        { status: 201 }
      );
    } catch (err) {
      // If parser is not available, still return success for application creation
      console.error("Resume parser error:", err);
      // Update application count anyway
      await prisma.internship.update({
        where: { id: internshipId },
        data: { applicationsCount: { increment: 1 } },
      });

      return NextResponse.json(
        {
          message: "Application submitted (resume parser failed)",
          application,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error applying for internship:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}