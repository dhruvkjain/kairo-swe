import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { userId, experience } = body

    if (!userId || !experience) {
      return NextResponse.json({ error: "Missing required data" }, { status: 400 })
    }

    const { id, role, company, duration, referenceEmails, description } = experience

    if (!id || !role || !company || !duration || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Fetch applicant by userId
    const applicant = await prisma.applicant.findUnique({
      where: { userId },
    })

    if (!applicant) {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 })
    }

    // Create new experience entry (includes ID)
    const newExperience = {
      id,
      role,
      company,
      duration,
      description,
      referenceEmails,
    }

    // Append or initialize experience array
    const updatedExperience = Array.isArray(applicant.experience)
      ? [...applicant.experience, newExperience]
      : [newExperience]

    // Update applicant’s experience JSON array
    await prisma.applicant.update({
      where: { userId },
      data: {
        experience: updatedExperience,
      },
    })

    return NextResponse.json(newExperience, { status: 200 })
  } catch (err) {
    console.error("Error adding experience:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
