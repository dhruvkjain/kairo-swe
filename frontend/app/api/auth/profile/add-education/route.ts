import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { applicantId, education } = await req.json()

    if (!applicantId || !education) {
      return NextResponse.json({ error: "Missing applicantId or education data" }, { status: 400 })
    }

    // Fetch existing applicant
    const applicant = await prisma.applicant.findUnique({
      where: { id: applicantId },
    })

    if (!applicant) {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 })
    }

    // Parse and merge existing education array (if any)
    let existingEducation: any[] = []
    if (Array.isArray(applicant.education)) {
      existingEducation = applicant.education
    } else if (typeof applicant.education === "object" && applicant.education !== null) {
      existingEducation = [applicant.education]
    }

    const updatedEducation = [...existingEducation, education]

    // Update applicant record
    await prisma.applicant.update({
      where: { id: applicantId },
      data: { education: updatedEducation },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Error saving education:", error)
    return NextResponse.json(
      { error: "Failed to save education", details: error.message },
      { status: 500 }
    )
  }
}
