import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();
    const sessionToken = cookies().get("sessionToken")?.value;

    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 401 });
    }

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL missing" }, { status: 400 });
    }

    const match = imageUrl.match(/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z]+$/);
    const publicId = match ? match[1] : null;

    if (!publicId) {
      return NextResponse.json({ error: "Invalid image URL format" }, { status: 400 });
    }

    // Delete image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    console.log(result);
    if (result.result !== "ok" && result.result !== "not found") {
      return NextResponse.json({ error: "Cloudinary delete failed", result }, { status: 500 });
    }

    // Remove image URL from DB
    await prisma.user.update({
      where: { id: session.userId },
      data: { image: null },
    });

    return NextResponse.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete image error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}
