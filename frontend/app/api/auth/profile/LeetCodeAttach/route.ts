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

    // Clean username. LeetCode urls are usually leetcode.com/u/username or leetcode.com/username
    const cleanUsername = leetcodeLink
      .trim()
      .replace(/^https?:\/\/(www\.)?leetcode\.com\/(u\/)?/, "") // removes https://leetcode.com/u/
      .split("/")[0];

    // Verify user exists on LeetCode
    const leetCodeUser = await fetchLeetCodeStats(cleanUsername);

    // Save to DB
    const updatedApplicant = await prisma.applicant.upsert({
      where: { userId },
      update: { leetcodeLink },
      create: {
        id: crypto.randomUUID(), // ✅ ADD THIS LINE
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