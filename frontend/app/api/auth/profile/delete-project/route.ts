import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
    const { userId, projectId } = await req.json();
    if (!userId || !projectId)
      return NextResponse.json({ error: "Missing userId or projectId" }, { status: 400 });

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
