import { NextResponse ,NextRequest} from "next/server";
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

export async function PUT(req: NextRequest) {
  try {
    const { applicationId, status } = await req.json();

    if (!applicationId || !status) {
      return NextResponse.json({ error: "Missing applicationId or status" }, { status: 400 });
    }

    // Build partial update data with only the one true flag updated
    let updateData = { status };

    if (status === "Shortlisted") {
      updateData.isShortlisted = true;
    } else if (status === "Hire") {
      updateData.isHire = true;
    } else if (status === "Interview") {
      updateData.selectInterview = true;
    } else if (status === "Reject") {
      updateData.isReject = true;
    } 

    // Perform the update with partial data. Other booleans are unchanged.
    const updatedApplication = await prisma.internshipApplication.update({
      where: { id: applicationId },
      data: updateData,
    });

    return NextResponse.json(updatedApplication, { status: 200 });
  } catch (error) {
    console.error("Error updating application status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
