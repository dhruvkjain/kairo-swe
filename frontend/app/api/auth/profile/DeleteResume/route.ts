import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, fileUrl } = await req.json();

    console.log("Received delete request for userId:", userId, "fileUrl:", fileUrl);
    if (!userId || !fileUrl) {
      return NextResponse.json({ error: "Missing userId or fileUrl" }, { status: 400 });
    }

    // Extract Uploadcare file UUID
    const match = fileUrl.match(
      /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/
    );
    const fileUUID = match ? match[0] : null;

    console.log("Extracted file UUID:", fileUUID);
    if (!fileUUID) {
      return NextResponse.json({ error: "Invalid file URL" }, { status: 400 });
    }

    // Delete file from Uploadcare
    const res = await fetch(`https://api.uploadcare.com/files/${fileUUID}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Uploadcare.Simple ${process.env.UPLOADCARE_PUBLIC_KEY}:${process.env.UPLOADCARE_SECRET_KEY}`,
        Accept: "application/vnd.uploadcare-v0.5+json",
      },
    });

    if (!res.ok) {
      console.error("Uploadcare deletion failed:", await res.text());
      return NextResponse.json({ error: "Failed to delete file from storage" }, { status: 500 });
    }

    // Clear resume link from Applicant table
    await prisma.applicant.update({
      where: { userId },
      data: { resumeLink: null },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting resume:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
