import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // 1. Get companyId from URL Query Params
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 });
    }

    // 2. Fetch Recruiters from Database
    const recruiters = await prisma.recruiter.findMany({
      where: {
        companyId: companyId,
      },
      select: {
        id: true,
        position: true,
        contactEmail: true,
        // 3. Join with the User table to get names/images
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(recruiters, { status: 200 });

  } catch (error) {
    console.error("Fetch recruiters error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}