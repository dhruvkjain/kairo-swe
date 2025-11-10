import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, title, description, link, skills } = await req.json();
    console.log("Received data:", { userId, title, description, link, skills });

    // Normalize skills: accept array, comma-separated string, or absent
    const normalizedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    if (!userId || !title || !description)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // Authenticate session
    const sessionToken = cookies().get("sessionToken")?.value;
    if (!sessionToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await prisma.session.findUnique({ where: { sessionToken } });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Authorize: only the profile owner can add a project
    if (session.userId !== userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const applicant = await prisma.applicant.findUnique({ where: { userId } });
    if (!applicant)
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 });

    const newProject = JSON.stringify({
      id: crypto.randomUUID(),
      title,
      description,
      link: link || "",
      skills: normalizedSkills,
    });

    const currentProjects = Array.isArray(applicant.projects)
      ? applicant.projects
      : [];
      
    const updatedApplicant = await prisma.applicant.update({
      where: { userId },
      data: { projects: [...applicant.projects, newProject] },
    });

    return NextResponse.json({ projects: updatedApplicant.projects });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add project" }, { status: 500 });
  }
}
