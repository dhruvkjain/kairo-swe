import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, InternshipType, InternshipMode, Stipendtype, UserType, InternshipStatus } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

interface InternshipPayload {
  id?: string;
  category?: string | null;
  title: string;
  slug?: string;
  description: string;
  location: string;
  type?: InternshipType;
  mode?: InternshipMode;
  stipend?: number | null;
  stipendType?: Stipendtype | null;
  durationWeeks?: number | null;
  openings?: number | null;
  skillsRequired?: string[];
  perks?: string[];
  question?: string[];
  requirements?: string | null;
  userType?: UserType | null;
  startDate?: string | Date | null;
  applicationDeadline?: string | Date | null;
  companyId: string;
  recruiterId: string;
  status?: InternshipStatus;
}

/**
 * GET /api/internships
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const internshipId = searchParams.get("internshipId");
    
    // Validate internshipId
    if (!internshipId) {
      return NextResponse.json(
        { error: "Missing internshipId in query parameters" },
        { status: 400 }
      );
    }

    const internship = await prisma.internship.findUnique({
      where: { id: internshipId },
      include: {
        company: true,
        recruiter: true,
      },
    });

    if (!internship) {
      return NextResponse.json(
        { error: "Internship not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(internship, { status: 200 });

  } catch (error) {
    console.error("❌ GET internship (single) error:", error);
    return NextResponse.json(
      { error: "Failed to fetch internship" },
      { status: 500 }
    );
  }
}


/**
 * POST /api/internships
 * Create a new internship (auto-handles duplicate slug)
 */
export async function POST(req: Request) {
  try {
    const body: InternshipPayload = await req.json();

    if (!body.title || !body.companyId || !body.recruiterId) {
      return NextResponse.json(
        { error: "Missing required fields: title, companyId, recruiterId" },
        { status: 400 }
      );
    }

    const recruiter = await prisma.recruiter.findUnique({ where: { userId : body.recruiterId } })

    // --- Auto-generate slug if not provided ---
    const baseSlug = slugify(body.slug || body.title, { lower: true, strict: true });

    // --- Ensure slug is unique ---
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.internship.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const internship = await prisma.internship.create({
      data: {
        category: body.category || null,
        title: body.title,
        slug,
        description: body.description,
        location: body.location,
        type: body.type || "ONSITE",
        mode: body.mode || "FULL_TIME",
        stipend: body.stipend ?? null,
        stipendType: body.stipendType ?? null,
        durationWeeks: body.durationWeeks ?? null,
        openings: body.openings ?? null,
        skillsRequired: body.skillsRequired ?? [],
        perks: body.perks ?? [],
        question: body.question ?? [],
        eligibility: body.requirements ?? null,
        userType: body.userType ?? null,
        startDate: body.startDate ? new Date(body.startDate) : null,
        applicationDeadline: body.applicationDeadline ? new Date(body.applicationDeadline) : null,
        companyId: body.companyId,
        recruiterId: recruiter?.id,
        status: body.status ?? "DRAFT",
      },
    });

    return NextResponse.json(internship, { status: 201 });
  } catch (error: any) {
    console.error("❌ POST internship error:", error);

    if (error.code === "P2002" && error.meta?.target?.includes("slug")) {
      return NextResponse.json(
        { error: "Slug already exists. Try a different title or slug." },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Failed to create internship" }, { status: 500 });
  }
}

/**
 * PUT /api/internships
 * Update an internship by ID
 */
export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const internshipId = searchParams.get("internshipId");
    
    // Validate internshipId
    if (!internshipId) {
      return NextResponse.json(
        { error: "Missing internshipId in query parameters" },
        { status: 400 }
      );
    }
    const body: InternshipPayload = await req.json();

    const internship = await prisma.internship.update({
      where: { id: internshipId },
      data: {
        category: body.category ?? undefined,
        title: body.title ?? undefined,
        slug: body.slug ?? undefined,
        description: body.description ?? undefined,
        location: body.location ?? undefined,
        type: body.type ?? undefined,
        mode: body.mode ?? undefined,
        stipend: body.stipend ?? undefined,
        stipendType: body.stipendType ?? undefined,
        durationWeeks: body.durationWeeks ?? undefined,
        openings: body.openings ?? undefined,
        skillsRequired: body.skillsRequired ?? undefined,
        perks: body.perks ?? undefined,
        question: body.question ?? undefined,
        eligibility: body.requirements ?? undefined,
        userType: body.userType ?? undefined,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        applicationDeadline: body.applicationDeadline ? new Date(body.applicationDeadline) : undefined,
        status: body.status ?? undefined,
      },
    });

    return NextResponse.json(internship, { status: 200 });
  } catch (error) {
    console.error("❌ PUT internship error:", error);
    return NextResponse.json({ error: "Failed to update internship" }, { status: 500 });
  }
}

/**
 * DELETE /api/internships
 * Delete an internship by ID
 */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const internshipId = searchParams.get("internshipId");

    if (!internshipId) {
      return NextResponse.json(
        { error: "Missing internshipId in query parameters" },
        { status: 400 }
      );
    }

    // Check if internship exists
    const existing = await prisma.internship.findUnique({
      where: { id: internshipId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Internship not found" },
        { status: 404 }
      );
    }

    // 🔥 Delete related records first using a transaction
    await prisma.$transaction([
      prisma.internshipApplication.deleteMany({
        where: { internshipId },
      }),
      prisma.internship.delete({
        where: { id: internshipId },
      }),
    ]);

    return NextResponse.json(
      { message: "Internship deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ DELETE internship error:", error);
    return NextResponse.json(
      { error: "Failed to delete internship" },
      { status: 500 }
    );
  }
}
