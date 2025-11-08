import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  console.log("Received request to attach LinkedIn profile");
  try {
    const sessionToken = cookies().get("sessionToken")?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    console.log("Session token found:", sessionToken);
    // Find user from Prisma using sessionToken
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { linkedinLink } = await req.json();

    console.log("Request body:", { linkedinLink });
    if (!linkedinLink) {
      return NextResponse.json(
        { error: "LinkedIn URL or username is required" },
        { status: 400 }
      );
    }

    // Clean up LinkedIn link
    const cleanLinkedin = linkedinLink
      .trim()
      // remove base URLs
      .replace(/^https?:\/\/(www\.)?linkedin\.com\//, "")
      // remove 'in/' prefix if present
      .replace(/^in\//, "")
      // remove trailing slashes
      .replace(/\/$/, "");

    console.log("Cleaned LinkedIn username:", cleanLinkedin);

    const linkedInLink = `https://www.linkedin.com/in/${cleanLinkedin}`;

    // Save to Applicant model
    const updatedApplicant = await prisma.applicant.upsert({
      where: { userId },
      update: { linkedInLink },
      create: {
        userId,
        linkedInLink,
      },
    });

    return NextResponse.json({
      message: "LinkedIn profile saved successfully",
      linkedInLink,
      applicant: updatedApplicant,
    });
  } catch (err: any) {
    console.error("Error attaching LinkedIn profile:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
