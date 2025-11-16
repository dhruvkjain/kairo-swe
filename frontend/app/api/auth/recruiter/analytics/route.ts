import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  // Your aggregation code to get monthly stats here
  const year = new Date().getFullYear(); // or accept as query param

  const result = await prisma.$queryRaw`
    SELECT
      TO_CHAR("createdAt", 'Mon') AS month,
      COUNT(*) AS applications,
      COUNT(CASE WHEN "isApplied" = true THEN 1 END) AS applications,
      COUNT(CASE WHEN "isShortlisted" = true THEN 1 END) AS shortlisted,
      COUNT(CASE WHEN "isHire" = true THEN 1 END) AS hired,
      COUNT(CASE WHEN "selectInterview" = true THEN 1 END) AS interviews
    FROM "InternshipApplication"
    WHERE EXTRACT(YEAR FROM "createdAt") = ${year}
    GROUP BY month
    ORDER BY MIN("createdAt")
  `;

  // Map for frontend compatibility
  const monthlyStats = result.map((r: any) => ({
    month: r.month,
    applications: Number(r.applications),
    shortlisted: Number(r.shortlisted),
    hired: Number(r.hired),
    interviews: Number(r.interviews)
  }));

  return NextResponse.json(monthlyStats);
}
