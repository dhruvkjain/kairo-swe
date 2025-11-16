import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    // Optional: get recruiter ID from query or session (for now, assume recruiterId)
    const { searchParams } = new URL(req.url);
    const recruitersId = searchParams.get("recruiterId");
    if (!recruitersId) {
      return NextResponse.json({ error: "Missing recruiterId" }, { status: 400 });
    }

    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: recruitersId },
    });
    const recruiterId = recruiter?.id

    const now = new Date();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay());
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 120);
    const endOfLastWeek = new Date(startOfThisWeek);

    // Helper to compute % change + trend
    const calcTrend = (thisWeek: number, lastWeek: number) => {
      const change = thisWeek - lastWeek;
      const percent = lastWeek ? ((change / lastWeek) * 100).toFixed(1) : "100";
      return {
        value: thisWeek,
        change,
        percent,
        trend: change >= 0 ? "up" : "down",
      };
    };

    // Active internships
    const activeThisWeek = await prisma.internship.count({
      where: {
        recruiterId,
        isActive: true,
        status: "DRAFT",
        createdAt: { gte: startOfThisWeek },
      },
    });

    const activeLastWeek = await prisma.internship.count({
      where: {
        recruiterId,
        isActive: true,
        status: "DRAFT",
        createdAt: { gte: startOfLastWeek, lt: endOfLastWeek },
      },
    });

    // Total applicants
    const internships = await prisma.internship.findMany({
      where: { recruiterId },
      select: { id: true },
    });
    const internshipIds = internships.map((i) => i.id);

    const totalApplicantsThisWeek = await prisma.internshipApplication.count({
      where: {
        internshipId: { in: internshipIds },
        createdAt: { gte: startOfThisWeek },
      },
    });

    const totalApplicantsLastWeek = await prisma.internshipApplication.count({
      where: {
        internshipId: { in: internshipIds },
        createdAt: { gte: startOfLastWeek, lt: endOfLastWeek },
      },
    });

    // Accepted applications
    const acceptedThisWeek = await prisma.internshipApplication.count({
      where: {
        internshipId: { in: internshipIds },
        status: "Hire",
        createdAt: { gte: startOfThisWeek },
      },
    });

    const acceptedLastWeek = await prisma.internshipApplication.count({
      where: {
        internshipId: { in: internshipIds },
        status: "Hire",
        createdAt: { gte: startOfLastWeek, lt: endOfLastWeek },
      },
    });

    // Rejected applications
    const rejectedThisWeek = await prisma.internshipApplication.count({
      where: {
        internshipId: { in: internshipIds },
        status: "Reject",
        createdAt: { gte: startOfThisWeek },
      },
    });

    const rejectedLastWeek = await prisma.internshipApplication.count({
      where: {
        internshipId: { in: internshipIds },
        status: "Reject",
        createdAt: { gte: startOfLastWeek, lt: endOfLastWeek },
      },
    });

    const stats = {
      activeInternships: calcTrend(activeThisWeek, activeLastWeek),
      totalApplicants: calcTrend(totalApplicantsThisWeek, totalApplicantsLastWeek),
      acceptedApplicants: calcTrend(acceptedThisWeek, acceptedLastWeek),
      rejectedApplicants: calcTrend(rejectedThisWeek, rejectedLastWeek),
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (err) {
    console.error("Error in dashboard stats:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
