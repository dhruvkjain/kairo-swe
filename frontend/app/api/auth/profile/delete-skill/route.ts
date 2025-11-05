import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const { userId, skill } = await req.json();
    if (!userId || !skill)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // Authenticate session
    const sessionToken = cookies().get("sessionToken")?.value;
    if (!sessionToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await prisma.session.findUnique({ where: { sessionToken } });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Authorize: only the profile owner can remove skills
    if (session.userId !== userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

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