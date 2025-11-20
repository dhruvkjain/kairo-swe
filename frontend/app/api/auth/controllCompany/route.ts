import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Recruiter ID is required" }, { status: 400 });
    }

    await prisma.recruiter.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Recruiter deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Delete recruiter error:", error);
    return NextResponse.json({ error: "Failed to delete recruiter" }, { status: 500 });
  }
}