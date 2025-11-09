import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { Prisma } from "@prisma/client"

export async function DELETE(req: NextRequest) {
  try {
    const { applicantId, educationId } = await req.json()

    if (!applicantId || !educationId) {
      return NextResponse.json({ error: "Missing applicantId or educationId" }, { status: 400 })
    }

    const applicant = await prisma.applicant.findUnique({
      where: { id: applicantId },
    })

    if (!applicant) {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 })
    }

    // Handle both array or stringified JSON cases
    let educations: any[] = []
    if (Array.isArray(applicant.education)) {
      educations = applicant.education
    } else if (typeof applicant.education === "string") {
      try {
        educations = JSON.parse(applicant.education)
      } catch {
        educations = []
      }
    }

    // Remove the target education
    const updatedEducation = educations.filter((edu) => edu.id !== educationId)

    // ✅ Update applicant with JSON-safe array
    await prisma.applicant.update({
      where: { id: applicantId },
      data: { education: updatedEducation as Prisma.InputJsonValue },
    })

    return NextResponse.json({ message: "Education deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting education:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
