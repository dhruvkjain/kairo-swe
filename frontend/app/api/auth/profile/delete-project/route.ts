import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const { userId, projectId } = await req.json();
    if (!userId || !projectId)
      return NextResponse.json({ error: "Missing userId or projectId" }, { status: 400 });

    // Authenticate session
    const sessionToken = cookies().get("sessionToken")?.value;
    if (!sessionToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await prisma.session.findUnique({ where: { sessionToken } });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Only owner can delete their project
    if (session.userId !== userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const applicant = await prisma.applicant.findUnique({ where: { userId } });
    if (!applicant)
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 });

    const updatedProjects = applicant.projects.filter((p) => {
      const parsed = JSON.parse(p);
      return parsed.id !== projectId;
    });

    await prisma.applicant.update({
      where: { userId },
      data: { projects: updatedProjects },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
