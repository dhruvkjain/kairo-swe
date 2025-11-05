import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const sessionToken = cookies().get("sessionToken")?.value;
    if (!sessionToken)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const session = await prisma.session.findUnique({
      where: { sessionToken },
    });
    if (!session)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.formData();
    // accept both 'image' and 'file' form fields (some clients use 'file')
    const rawFile = data.get("image") ?? data.get("file");
    const file = rawFile instanceof File ? (rawFile as File) : null;

    if (!file) {
      console.error('No file found in formData. Keys:', Array.from(data.keys()))
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert file to base64 so Cloudinary can accept it
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64String, {
      folder: "profile_pictures", // optional Cloudinary folder
      public_id: `${session.userId}-${Date.now()}`,
      resource_type: "auto",
    });

    // Save Cloudinary URL to user record
    const imageUrl = uploadResponse.secure_url;

    await prisma.user.update({
      where: { id: session.userId },
      data: { image: imageUrl },
    });

    return NextResponse.json({ success: true, imageUrl });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
