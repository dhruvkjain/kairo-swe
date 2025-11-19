import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const { userId, leetcodeLink } = await request.json();

    if (!userId || !leetcodeLink) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const updatedApplicant = await prisma.applicant.update({
      where: { userId },
      data: { leetcodeLink },
    });

    return NextResponse.json({
      message: "LeetCode link updated",
      leetcodeLink: updatedApplicant.leetcodeLink,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}