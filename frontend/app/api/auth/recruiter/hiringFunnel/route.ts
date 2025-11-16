import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const result = await prisma.$queryRaw`
    SELECT
      COALESCE(COUNT(CASE WHEN "isApplied" = true THEN 1 END), 0) AS "totalApplied",
      COALESCE(COUNT(CASE WHEN "isShortlisted" = true THEN 1 END), 0) AS "totalShortlisted",
      COALESCE(COUNT(CASE WHEN "isHire" = true THEN 1 END), 0) AS "totalHired",
      COALESCE(COUNT(CASE WHEN "selectInterview" = true THEN 1 END), 0) AS "totalInterviews"
    FROM "InternshipApplication"
  `;

  // Extract the first (and only) row result
  const data = result[0];

  // Map BigInt values to Number and form array response
  const response = [
    { stage: "Applied", count: Number(data.totalApplied) },
    { stage: "Shortlisted", count: Number(data.totalShortlisted) },
    { stage: "Interviews", count: Number(data.totalInterviews) },
    { stage: "Hired", count: Number(data.totalHired) },
  ];

  return NextResponse.json(response);
}
