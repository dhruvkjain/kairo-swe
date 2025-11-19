import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  // 1. Get the current year
  const currentYear = new Date().getFullYear();

  // 2. Inject the year into the query safely
  // Note: We assume your date column is named "createdAt"
  const result: any = await prisma.$queryRaw`
    SELECT
      COALESCE(COUNT(CASE WHEN "isApplied" = true THEN 1 END), 0) AS "totalApplied",
      COALESCE(COUNT(CASE WHEN "isShortlisted" = true THEN 1 END), 0) AS "totalShortlisted",
      COALESCE(COUNT(CASE WHEN "isHire" = true THEN 1 END), 0) AS "totalHired",
      COALESCE(COUNT(CASE WHEN "selectInterview" = true THEN 1 END), 0) AS "totalInterviews"
    FROM "InternshipApplication"
    WHERE EXTRACT(YEAR FROM "createdAt") = ${currentYear}
  `;

  // 3. Handle case where no data exists for the year
  const data = result[0] || { 
    totalApplied: 0, 
    totalShortlisted: 0, 
    totalHired: 0, 
    totalInterviews: 0 
  };

  const response = [
    { stage: "Applied", count: Number(data.totalApplied) },
    { stage: "Shortlisted", count: Number(data.totalShortlisted) },
    { stage: "Interviews", count: Number(data.totalInterviews) },
    { stage: "Hired", count: Number(data.totalHired) },
  ];

  return NextResponse.json(response);
}