import { NextRequest, NextResponse } from "next/server";
import { UploadClient } from "@uploadcare/upload-client";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // Get session token from cookies
    const sessionToken = cookies().get("sessionToken")?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify session and get userId
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: { include: { applicant: true } } },
    });

    if (!session?.user?.applicant) {
      return NextResponse.json(
        { error: "Unauthorized or applicant profile not found" },
        { status: 403 }
      );
    }

    let body;
    try {
      body = await req.json();
      console.log('Received request body:', {
        hasFileBase64: !!body.fileBase64,
        fileName: body.fileName,
        contentLength: req.headers.get('content-length'),
        bodyKeys: Object.keys(body)
      });
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const { fileBase64, fileName } = body;

    if (!fileBase64 || typeof fileBase64 !== 'string') {
      return NextResponse.json({ error: "Missing or invalid file data" }, { status: 400 });
    }

    // Validate base64 format
    try {
      const buffer = Buffer.from(fileBase64, 'base64');
      if (buffer.length === 0) {
        return NextResponse.json({ error: "Empty file data" }, { status: 400 });
      }
    } catch (error) {
      console.error('Invalid base64 data:', error);
      return NextResponse.json({ error: "Invalid file data format" }, { status: 400 });
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

    // Update the applicant's resume link using the session user's applicant record
    await prisma.applicant.update({
      where: { id: session.user.applicant.id },
      data: { resumeLink: cdnUrl },
    });

    return NextResponse.json({ message: "File uploaded", fileUrl: cdnUrl });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
