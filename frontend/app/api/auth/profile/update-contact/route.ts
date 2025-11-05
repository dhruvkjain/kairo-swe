import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, primaryPhone, secondaryPhone } = await req.json();

    if (!userId || !primaryPhone) {
      return NextResponse.json(
        { error: "userId and primaryPhone are required" },
        { status: 400 }
      );
    }

    // Authenticate session
    const sessionToken = cookies().get("sessionToken")?.value;
    if (!sessionToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const session = await prisma.session.findUnique({ where: { sessionToken } });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Only owner may update contact info
    if (session.userId !== userId)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const phoneNumbers = [primaryPhone];
    if (secondaryPhone?.trim()) phoneNumbers.push(secondaryPhone.trim());

    const updatedApplicant = await prisma.applicant.update({
      where: { userId },
      data: { phoneNumber: phoneNumbers },
    });

    return NextResponse.json({
      message: "Contact numbers updated successfully",
      applicant: updatedApplicant,
    });
  } catch (error: any) {
    console.error("Error updating contact info:", error);
    return NextResponse.json(
      { error: "Failed to update contact info" },
      { status: 500 }
    );
  }
}
