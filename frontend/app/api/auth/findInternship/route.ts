import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ---------------- GET: Search Internships ----------------
export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;

    const search = params.get("search") || "";
    const location = params.get("location");
    const mode = params.get("mode");
    const type = params.get("type");
    const category = params.get("category");
    const minStipend = params.get("minStipend");
    const maxStipend = params.get("maxStipend");
    const skillsParam = params.get("skills");

    // ---- Build filters ----
    const filters: any = {
      isActive: true,
      AND: [],
    };

    if (search) {
      filters.AND.push({
        title: { contains: search, mode: "insensitive" },
      });
    }

    if (location) {
      filters.AND.push({
        location: { contains: location, mode: "insensitive" },
      });
    }

    if (minStipend || maxStipend) {
      const stipendFilter: any = {};
      if (minStipend) stipendFilter.gte = Number(minStipend);
      if (maxStipend) stipendFilter.lte = Number(maxStipend);
      filters.AND.push({ stipend: stipendFilter });
    }

    if (mode) filters.AND.push({ mode });
    if (type) filters.AND.push({ type });
    if (category) filters.AND.push({ category });

    if (skillsParam) {
      const skills = skillsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (skills.length > 0) {
        filters.AND.push({
          OR: skills.map((skill) => ({
            skillsRequired: { has: skill },
          })),
        });
      }
    }

    const internships = await prisma.internship.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
    });

    if (!internships || internships.length === 0) {
      return NextResponse.json(
        { message: "No internships found" },
        { status: 404 }
      );
    }

    return NextResponse.json(internships, { status: 200 });
  } catch (error) {
    console.error("Error fetching internships:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ---------------- POST: Apply to Internship ----------------
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

    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
    });

    if (!internship) {
      return NextResponse.json(
        { error: "Internship not found" },
        { status: 404 }
      );
    }

    // Check if the user already applied
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
      },
      include: {
        internship: true,
      },
    });

    await prisma.internship.update({
      where: { id: internshipId },
      data: { applicationsCount: { increment: 1 } },
    });

    return NextResponse.json(
      {
        message: "Application submitted successfully",
        application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error applying for internship:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
