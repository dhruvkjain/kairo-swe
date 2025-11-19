import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// import { requireAuth } from "@/lib/auth"; // Uncomment if you use this helper

export async function DELETE(req: Request) {
  try {
    // const currentUser = await requireAuth(); // Uncomment if needed
    const { userId, field } = await req.json();

    if (field !== "leetcodeLink") {
      return NextResponse.json({ error: "Invalid field" }, { status: 400 });
    }

    await prisma.applicant.update({
      where: { userId },
      data: { leetcodeLink: null },
    });

    return NextResponse.json({ message: "LeetCode link removed" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}