import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const { userId, projectId, title, description, skills } = await req.json();
    if (!userId || !projectId || !title || !description || !skills?.length)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const applicant = await prisma.applicant.findUnique({ where: { userId } });
    if (!applicant)
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 });

    const updatedProjects = applicant.projects.map((p) => {
      const parsed = JSON.parse(p);
      if (parsed.id === projectId) {
        return JSON.stringify({
          ...parsed,
          title,
          description,
          skills,
        });
      }
      return p;
    });

    await prisma.applicant.update({
      where: { userId },
      data: { projects: updatedProjects },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error editing project:", error);
    return NextResponse.json({ error: "Failed to edit project" }, { status: 500 });
  }
}
