import { NextRequest, NextResponse } from "next/server";
import { fetchCodeforcesStats } from "@/lib/codeforces_api";
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
    const { codeforcesLink } = await req.json();

    if (!codeforcesLink) {
      return NextResponse.json({ error: "Link is required" }, { status: 400 });
    }

    // Clean username. Handles: https://codeforces.com/profile/username or just username
    const cleanUsername = codeforcesLink
      .trim()
      .replace(/^https?:\/\/(www\.)?codeforces\.com\/profile\//, "") 
      .split("/")[0];

    // Verify user exists on Codeforces
    const cfUser = await fetchCodeforcesStats(cleanUsername);

    // Save to DB
    const updatedApplicant = await prisma.applicant.upsert({
      where: { userId },
      update: { codeforcesLink },
      create: { 
        id: crypto.randomUUID(), // Key fix we learned from LeetCode!
        userId, 
        codeforcesLink 
      },
    });

    return NextResponse.json({
      message: "Codeforces linked successfully",
      cfData: cfUser,
      applicant: updatedApplicant,
    });
  } catch (err: any) {
    console.error("Error linking Codeforces:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}