import { NextRequest, NextResponse } from "next/server";
import { getGitHubUser } from "@/lib/GithubAPI";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  console.log("Received request to attach GitHub profile");
  try {
    const sessionToken = cookies().get("sessionToken")?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    // Find user from Prisma using sessionToken
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
    }

    const userId = session.user.id;
    const { githubLink } = await req.json();

    console.log("Request body:", { githubLink });
    if (!githubLink) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    console.log("Received GitHub username:", githubLink);

    // Clean up username if user pasted full GitHub URL
    const cleanUsername = githubLink
      .trim()
      .replace(/^https?:\/\/(www\.)?github\.com\//, "")
      .split("/")[0];

    console.log("Cleaned GitHub username:", cleanUsername);

    // Fetch GitHub user data
    const githubUser = await getGitHubUser(cleanUsername);

    // Save to Applicant model
    const updatedApplicant = await prisma.applicant.upsert({
      where: { userId },
      update: { githubLink },
      create: {
        userId,
        githubLink,
      },
    });

    return NextResponse.json({
      message: "GitHub data fetched and saved successfully",
      githubData: githubUser,
      applicant: updatedApplicant,
    });
  } catch (err: any) {
    console.error("Error fetching GitHub data:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
