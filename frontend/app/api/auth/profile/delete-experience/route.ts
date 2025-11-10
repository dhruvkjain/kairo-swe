import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function DELETE(req: Request) {
  try {
    const { userId, experienceId } = await req.json()

    console.log("🗑️ Delete request for experienceId:", experienceId, "by userId:", userId)
    if (!userId || !experienceId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Fetch applicant data
    const applicant = await prisma.applicant.findUnique({
      where: { userId },
      select: { experience: true },
    })

    console.log("📝 Applicant experience data:", applicant)
    if (!applicant) {
      return NextResponse.json({ message: "Applicant not found" }, { status: 404 })
    }

    // If no experience array found
    const experiences = Array.isArray(applicant.experience)
      ? applicant.experience
      : []

    // Filter out the one to delete by id
    const updatedExperiences = experiences.filter(
      (exp: any) => exp.id !== experienceId
    )

    // Update applicant record
    await prisma.applicant.update({
      where: { userId },
      data: { experience: updatedExperiences },
    })

    return NextResponse.json(
      { message: "Experience deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("❌ Error deleting experience:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
