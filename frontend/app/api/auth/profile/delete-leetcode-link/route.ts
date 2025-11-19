import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request) {
  try {
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