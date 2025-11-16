import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const recruiterId = searchParams.get("recruiterId");
    
    // Validate recruiterId
    if (!recruiterId) {
      return NextResponse.json(
        { error: "Missing recruiterId in query parameters" },
        { status: 400 }
      );
    }

    // Find the recruiter
    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: recruiterId },
    });

    if (!recruiter) {
      return NextResponse.json(
        { error: "Recruiter not found" },
        { status: 404 }
      );
    }

    // Fetch internships
    const internships = await prisma.internship.findMany({
      where: { recruiterId: recruiter.id },
      orderBy: { createdAt: "desc" },
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
