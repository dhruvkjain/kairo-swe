import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const { userId, projectId, title, description, skills, link } = await req.json();
    if (!userId || !projectId || !title || !description || !skills?.length)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    // Authenticate session
    const sessionToken = cookies().get("sessionToken")?.value;
    if (!sessionToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await prisma.session.findUnique({ where: { sessionToken } });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Authorize
    if (session.userId !== userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

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
          link: link || parsed.link || "",
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
