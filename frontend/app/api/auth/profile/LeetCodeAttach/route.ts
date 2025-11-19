import { NextRequest, NextResponse } from "next/server";
import { fetchLeetCodeStats } from "@/lib/leetcode_api";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const sessionToken = cookies().get("sessionToken")?.value;
    if (!sessionToken) return NextResponse.json({ error: "No session" }, { status: 401 });

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session?.user) return NextResponse.json({ error: "Invalid session" }, { status: 401 });

    const userId = session.user.id;
    const { leetcodeLink } = await req.json();

    if (!leetcodeLink) {
      return NextResponse.json({ error: "Link is required" }, { status: 400 });
    }

    
    const cleanUsername = leetcodeLink
      .trim()
      .replace(/^https?:\/\/(www\.)?leetcode\.com\/(u\/)?/, "")
      .split("/")[0];

    
    const leetCodeUser = await fetchLeetCodeStats(cleanUsername);

    
    const updatedApplicant = await prisma.applicant.upsert({
      where: { userId },
      update: { leetcodeLink },
      create: {
        id: crypto.randomUUID(), 
        userId,
        leetcodeLink,
      },
    });

    return NextResponse.json({
      message: "LeetCode linked successfully",
      leetcodeData: leetCodeUser,
      applicant: updatedApplicant,
    });
  } catch (err: any) {
    console.error("Error linking LeetCode:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}