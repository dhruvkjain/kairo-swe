import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function PATCH(
  request: Request,
  { params }: { params: { Id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const data = await request.json();
    const userId = params.Id;

    // Verify ownership
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.id !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (user.role === "APPLICANT") {
      const updatedApplicant = await prisma.applicant.update({
        where: { userId },
        data: {
          about: data.about,
          linkedInLink: data.linkedInLink,
          githubLink: data.githubLink,
          portfolioLink: data.portfolioLink,
          skills: data.skills,
          experience: data.experience,
          phoneNumber: data.phoneNumber,
        },
      });
      return NextResponse.json(updatedApplicant);
    } else {
      const updatedRecruiter = await prisma.recruiter.update({
        where: { userId },
        data: {
          about: data.about,
          linkedInLink: data.linkedInLink,
          companyName: data.companyName,
          companyWebsite: data.companyWebsite,
          industry: data.industry,
          phoneNumber: data.phoneNumber,
          experience: data.experience,
        },
      });
      return NextResponse.json(updatedRecruiter);
    }
  } catch (error) {
    console.error("[PROFILE_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}