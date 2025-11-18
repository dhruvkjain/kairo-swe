import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const recruiterId = searchParams.get('recruiterId');

    if (!recruiterId) {
      return NextResponse.json({ error: 'recruiterId is required' }, { status: 400 });
    }

    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: recruiterId },
    });

    if (!recruiter) {
      return NextResponse.json({ error: 'Recruiter not found' }, { status: 404 });
    }

    const internships = await prisma.internship.findMany({
      where: { recruiterId: recruiter.id },
      select: { id: true },
    });

    const internshipIds = internships.map((internship) => internship.id);

    if (internshipIds.length === 0) {
      return NextResponse.json({ error: 'No internships found for this recruiter' }, { status: 404 });
    }

    // Corrected: selectInterview is moved into where clause properly
    const data = await prisma.internshipApplication.findMany({
      where: {
        internshipId: { in: internshipIds },
        status : "Interview",
      },
      select: {
        id:true,
        resumeData: true,
        interviewMode: true,
        interviewLocation: true,
        interviewDate: true,
        interviewTime: true,
      },
    });

    if (data.length === 0) {
      return NextResponse.json({ error: 'No interview selected or applicants found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error retrieving internship application:', error);
    return NextResponse.json({ error: 'Failed to retrieve data' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const applicantId = searchParams.get("applicantId");

    if (!applicantId) {
      return NextResponse.json({ error: "applicantId is required" }, { status: 400 });
    }

    const body = await req.json();
    const {
      interviewMode,
      interviewLocation,
      interviewDate,
      interviewTime,
    } = body;

    if (
      interviewMode === undefined &&
      interviewLocation === undefined &&
      interviewDate === undefined &&
      interviewTime === undefined
    ) {
      return NextResponse.json({ error: "No update fields provided" }, { status: 400 });
    }

    const updateData: Record<string, any> = {
      status: "Interview", // Assuming this means interview is selected now
    };

    if (interviewMode !== undefined) updateData.interviewMode = interviewMode;
    if (interviewLocation !== undefined) updateData.interviewLocation = interviewLocation;
    if (interviewDate !== undefined)
      updateData.interviewDate = interviewDate;
    if (interviewTime !== undefined)
      updateData.interviewTime = interviewTime || null;

    // Use update because id is unique
    await prisma.internshipApplication.update({
      where: { id: applicantId },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: "Interview schedule updated successfully"
    });

  } catch (error) {
    console.error('Error updating interview:', error);
    return NextResponse.json({ error: "Failed to update interview(s)" }, { status: 500 });
  }
}
