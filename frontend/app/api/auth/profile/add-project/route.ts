import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, title, description, skills } = await req.json();
    if (!userId || !title || !description || !skills?.length)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const applicant = await prisma.applicant.findUnique({ where: { userId } });
    if (!applicant)
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 });

    const newProject = JSON.stringify({
      id: crypto.randomUUID(),
      title,
      description,
      skills,
    });

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
