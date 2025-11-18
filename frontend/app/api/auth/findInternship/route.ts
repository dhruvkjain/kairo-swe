import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// ---------------- GET: Search Internships ----------------
export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;

    const search = params.get("search") || "";
    const location = params.get("location");
    const mode = params.get("mode");
    const type = params.get("type");
    const category = params.get("category");
    const minStipend = params.get("minStipend");
    const maxStipend = params.get("maxStipend");
    const skillsParam = params.get("skills");

    // ---- Build filters ----
    const filters: any = {
      isActive: true,
      AND: [],
    };

    if (search) {
      filters.AND.push({
        title: { contains: search, mode: "insensitive" },
      });
    }

    if (location) {
      filters.AND.push({
        location: { contains: location, mode: "insensitive" },
      });
    }

    if (minStipend || maxStipend) {
      const stipendFilter: any = {};
      if (minStipend) stipendFilter.gte = Number(minStipend);
      if (maxStipend) stipendFilter.lte = Number(maxStipend);
      filters.AND.push({ stipend: stipendFilter });
    }

    if (mode) filters.AND.push({ mode });
    if (type) filters.AND.push({ type });
    if (category) filters.AND.push({ category });

    if (skillsParam) {
      const skills = skillsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      if (skills.length > 0) {
        filters.AND.push({
          OR: skills.map((skill) => ({
            skillsRequired: { has: skill },
          })),
        });
      }
    }

    const internships = await prisma.internship.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
    });

    if (!internships || internships.length === 0) {
      return NextResponse.json(
        { message: "No internships found" },
        { status: 404 }
      );
    }

    return NextResponse.json(internships, { status: 200 });
  } catch (error) {
    console.error("Error fetching internships:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
