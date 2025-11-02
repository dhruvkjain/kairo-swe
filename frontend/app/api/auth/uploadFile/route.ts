import { NextRequest, NextResponse } from "next/server";
import { UploadClient } from "@uploadcare/upload-client";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { fileBase64, fileName, userId } = await req.json();

    if (!fileBase64 || !userId) {
      return NextResponse.json({ error: "Missing file or userId" }, { status: 400 });
    }

    const client = new UploadClient({
      publicKey: process.env.UPLOADCARE_PUBLIC_KEY!,
    });

    const fileBuffer = Buffer.from(fileBase64, "base64");

    const uploadedFile = await client.uploadFile(fileBuffer, {
      fileName: fileName || "upload.pdf",
      store: true,
    });

    const cdnUrl = `https://4skqvn8fb2.ucarecd.net/${uploadedFile.uuid}/${fileName || "file.pdf"}`;

    await prisma.applicant.update({
      where: { userId },
      data: { resumeLink: cdnUrl },
    });

    return NextResponse.json({ message: "File uploaded", fileUrl: cdnUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
