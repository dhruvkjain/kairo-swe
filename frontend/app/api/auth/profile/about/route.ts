import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, about, role } = await req.json();

    if (!userId || typeof about !== "string" || !role) {
      return NextResponse.json({ message: "Invalid request data" }, { status: 400 });
    }

    if (role === "APPLICANT") {
      await prisma.applicant.update({
        where: { userId },
        data: { about },
      });
    } else if (role === "RECRUITER") {
      await prisma.recruiter.update({
        where: { userId },
        data: { about },
      });
    } else {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    return NextResponse.json({ message: "About section updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating About section:", error);
    return NextResponse.json(
      { message: "Server error while updating About section" },
      { status: 500 }
    );
  }
}
