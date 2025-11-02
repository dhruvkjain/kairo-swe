import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const params = req.nextUrl.searchParams;

        const search = params.get("search") || ""; // title search
        const location = params.get("location");
        const minStipend = params.get("minStipend");
        const maxStipend = params.get("maxStipend");
        const mode = params.get("mode"); // FULL_TIME / PART_TIME
        const type = params.get("type"); // REMOTE / ONSITE / HYBRID
        const category = params.get("category"); // ENGINEERING, MARKETING, etc.
        const skillsParam = params.get("skills"); // e.g. "react,nodejs"

        // Build dynamic filters
        const filters: any = {
            isActive: true, // Only return active internships
        };

        // Title search
        if (search) {
            filters.title = { contains: search, mode: "insensitive" };
        }

        // Location filter
        if (location) {
            filters.location = { contains: location, mode: "insensitive" };
        }

        // Stipend range
        if (minStipend || maxStipend) {
            filters.stipend = {};
            if (minStipend) filters.stipend.gte = Number(minStipend);
            if (maxStipend) filters.stipend.lte = Number(maxStipend);
        }

        // Mode and Type
        if (mode) filters.mode = mode as any;
        if (type) filters.type = type as any;

        // Category filter
        if (category) {
            filters.category = category as any; // Prisma enum filter
        }

        // Skill-based search
        if (skillsParam) {
            const skills = skillsParam
                .split(",")
                .map((s) => s.trim().toLowerCase())
                .filter(Boolean);

            // Match internships that have ANY of the provided skills
            filters.OR = skills.map((skill) => ({
                skillsRequired: {
                    has: skill,
                },
            }));
        }

        // Query database
        const internships = await prisma.internship.findMany({
            where: filters,
            orderBy: {
                createdAt: "desc",
            },
        });

        if (internships.length === 0) {
            return NextResponse.json(
                { message: "No internships found" },
                { status: 404 }
            );
        }

        return NextResponse.json(internships, { status: 200 });
    } catch (error) {
        console.error("Error searching internships:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}


export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { internshipId, userId, coverLetter, resumeUrl } = body;

        // Validate input
        if (!internshipId || !userId) {
            return NextResponse.json(
                { error: "internshipId and userId are required" },
                { status: 400 }
            );
        }

        // Check internship existence
        const internship = await prisma.internship.findUnique({
            where: { id: internshipId },
        });

        if (!internship) {
            return NextResponse.json(
                { error: "Internship not found" },
                { status: 404 }
            );
        }

        // Prevent duplicate applications
        const existingApp = await prisma.internshipApplication.findUnique({
            where: {
                internshipId_applicantId: {
                    internshipId,
                    applicantId: userId,
                },
            },
        });

        if (existingApp) {
            return NextResponse.json(
                { message: "You have already applied for this internship" },
                { status: 409 }
            );
        }

        // Create new application
        const application = await prisma.internshipApplication.create({
            data: {
                internshipId,
                applicantId: userId,
                coverLetter,
                resumeUrl,
            },
            include: {
                internship: true,
            },
        });

        await prisma.internship.update({
            where: { id: internshipId },
            data: { applicationsCount: { increment: 1 } },
        });


        return NextResponse.json(
            {
                message: "Application submitted successfully",
                application,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error applying for internship:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
