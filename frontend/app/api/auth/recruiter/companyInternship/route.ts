import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const recruiterId = searchParams.get("recruiterId");

    if (!recruiterId) {
      return NextResponse.json(
        { error: "Missing recruiterId in query parameters" },
        { status: 400 }
      );
    }

    // 1. Find the requesting recruiter
    const currentRecruiter = await prisma.recruiter.findUnique({
      where: { userId: recruiterId },
    });

    if (!currentRecruiter) {
      return NextResponse.json(
        { error: "Recruiter not found" },
        { status: 404 }
      );
    }

    // 2. Find all recruiters belonging to that company
    const colleagues = await prisma.recruiter.findMany({
      where: { companyId: currentRecruiter.companyId },
      select: { id: true }, // Optimization: Only fetch the IDs
    });

    // 3. Create an array of IDs (e.g., [1, 2, 5])
    const recruiterIds = colleagues.map((colleague) => colleague.id);

    // 4. Fetch internships where the recruiterId is IN that list
    const internships = await prisma.internship.findMany({
      where: {
        recruiterId: {
          in: recruiterIds, 
        },
      },
      orderBy: { createdAt: "desc" },
      // Optional: Include relations if you need company details
      // include: { recruiter: true } 
    });

    return NextResponse.json(internships, { status: 200 });
  } catch (error) {
    console.error("GET /api/internships error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}