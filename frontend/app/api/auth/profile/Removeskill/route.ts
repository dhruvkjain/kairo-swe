import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function DELETE(req: Request) {
  try {
    const { userId, skill } = await req.json();
    if (!userId || !skill)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const applicant = await prisma.applicant.findUnique({ where: { userId } });
    if (!applicant)
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 });

    const updatedSkills = (applicant.skills || []).filter((s) => s !== skill);

    const updatedApplicant = await prisma.applicant.update({
      where: { userId },
      data: { skills: updatedSkills },
    });

    return NextResponse.json({ skills: updatedApplicant.skills });
  } catch (error) {
    console.error("Error removing skill:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}