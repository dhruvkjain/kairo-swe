import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /profile/experience?userId=xyz
 * Returns the experience list for a specific applicant
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const applicant = await prisma.applicant.findUnique({
    where: { userId },
    select: { experience: true },
  });

  if (!applicant) {
    return NextResponse.json({ error: "Applicant not found" }, { status: 404 });
  }

  return NextResponse.json(applicant.experience || []);
}

/**
 * POST /profile/experience
 * Body: { userId, experience: "Frontend Intern at ABC Corp" }
 * Adds a new experience
 */
export async function POST(request: Request) {
  const body = await request.json();
  const { userId, experience } = body;

  if (!userId || !experience) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const applicant = await prisma.applicant.findUnique({ where: { userId } });
  if (!applicant) {
    return NextResponse.json({ error: "Applicant not found" }, { status: 404 });
  }

  const updated = await prisma.applicant.update({
    where: { userId },
    data: { experience: [...(applicant.experience || []), experience] },
  });

  return NextResponse.json(updated.experience);
}

/**
 * PUT /profile/experience
 * Body: { userId, index, experience }
 * Updates an existing experience item
 */
export async function PUT(request: Request) {
  const body = await request.json();
  const { userId, index, experience } = body;

  if (!userId || index === undefined || !experience) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const applicant = await prisma.applicant.findUnique({ where: { userId } });
  if (!applicant) {
    return NextResponse.json({ error: "Applicant not found" }, { status: 404 });
  }

  const expList = [...(applicant.experience || [])];
  if (index < 0 || index >= expList.length) {
    return NextResponse.json({ error: "Invalid index" }, { status: 400 });
  }

  expList[index] = experience;

  const updated = await prisma.applicant.update({
    where: { userId },
    data: { experience: expList },
  });

  return NextResponse.json(updated.experience);
}

/**
 * DELETE /profile/experience
 * Body: { userId, index }
 * Deletes a specific experience item
 */
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    // ✅ Validation
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // ✅ Check applicant existence
    const applicant = await prisma.applicant.findUnique({
      where: { userId },
    });

    if (!applicant) {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 });
    }

    // ✅ Clear all experiences
    const updated = await prisma.applicant.update({
      where: { userId },
      data: { experience: [] },
    });

    return NextResponse.json({
      message: "All experiences deleted successfully",
      experience: updated.experience,
    });
  } catch (error) {
    console.error("Error deleting experiences:", error);
    return NextResponse.json(
      { error: "Failed to delete experiences" },
      { status: 500 }
    );
  }
}
