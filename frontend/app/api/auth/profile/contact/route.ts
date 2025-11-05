import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PUT(req: Request) {
  try {
    const { userId, primaryPhone, secondaryPhone } = await req.json();

    if (!userId || !primaryPhone) {
      return NextResponse.json(
        { error: "userId and primaryPhone are required" },
        { status: 400 }
      );
    }

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
