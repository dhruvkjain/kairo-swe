import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

function extractPublicIdFromUrl(urlStr: string): string | null {
  try {
    // Regex breakdown:
    // /upload\/     - Matches the literal "/upload/"
    // (?:[a-z0-9_,-]+\/)? - Optionally matches transformation string (e.g., "w_100,c_fill/")
    // (?:v\d+\/)?    - Optionally matches version string (e.g., "v123456/")
    // (.+)          - Captures the public_id (e.g., "folder/image")
    // \.[a-zA-Z0-9]+$ - Matches the file extension at the end of the string
    const match = urlStr.match(
      /upload\/(?:[a-z0-9_,-]+\/)?(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/
    );
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1) session check
    const sessionToken = cookies().get("sessionToken")?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await prisma.session.findUnique({ where: { sessionToken } });
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    // 2) get user from DB
    const user = await prisma.user.findUnique({ where: { id: session.userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3) read formData (new file and optional oldImageUrl)
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const oldImageUrl = (formData.get("oldImageUrl") as string) || null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const deletionResult: any = {
      attempted: false,
      success: false,
      result: null,
      reason: null,
    };

    // 4) If oldImageUrl provided, ensure it belongs to this user & attempt delete
    if (oldImageUrl) {
      // Security check: only allow deleting the image that matches user's DB value
      if (user.image !== oldImageUrl) {
        deletionResult.reason =
          "Old image URL from client does not match user's image URL in DB.";
        console.warn(
          `EditPic: Aborting deletion. DB URL: "${user.image}" | Client URL: "${oldImageUrl}"`
        );
        // NOTE: If you are *sure* the URLs are just different due to transformations,
        // you might consider removing this check, but it's a security risk.
        // For now, we'll stop here as the check failed.
        // We will *still proceed* to upload the new image, just not delete the old one.
      } else {
        // URLs match, proceed with deletion attempt
        const publicId = extractPublicIdFromUrl(oldImageUrl);

        if (publicId) {
          try {
            deletionResult.attempted = true;
            console.log("EditPic: Attempting to delete Cloudinary publicId:", publicId);

            const destroyRes = await cloudinary.uploader.destroy(publicId, {
              invalidate: true,
              resource_type: "image",
            });

            deletionResult.result = destroyRes;

            // Explicitly check the result from Cloudinary
            if (destroyRes.result === "ok") {
              deletionResult.success = true;
              console.log("EditPic: Successfully deleted old image.", destroyRes);
            } else {
              // This handles cases like "not found"
              deletionResult.success = false;
              deletionResult.reason = `Cloudinary returned: ${destroyRes.result}`;
              console.warn("EditPic: Cloudinary deletion failed.", destroyRes);
            }
          } catch (err: any) {
            deletionResult.reason = `Cloudinary destroy error: ${err.message || String(err)}`;
            console.error("EditPic: Cloudinary destroy API error:", err);
          }
        } else {
          deletionResult.reason = "Could not extract publicId from oldImageUrl.";
          console.warn(
            "EditPic: Failed to extract publicId from oldImageUrl:",
            oldImageUrl
          );
        }
      }
    } else {
      deletionResult.reason = "No oldImageUrl was provided by the client.";
      console.log("EditPic: No oldImageUrl provided, skipping deletion.");
    }

    // 5) Upload new image to Cloudinary
    console.log("EditPic: Uploading new image...");
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResponse: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "profile_pics", resource_type: "image" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(buffer);
    });

    const imageUrl = uploadResponse.secure_url;
    const newPublicId = uploadResponse.public_id;
    console.log("EditPic: New image uploaded. Public ID:", newPublicId);

    // 6) Update user record (only image url as requested)
    await prisma.user.update({
      where: { id: session.userId },
      data: { image: imageUrl },
    });
    console.log("EditPic: User record updated in database.");

    // 7) return useful info (deletion + upload results)
    return NextResponse.json(
      {
        message: "Image updated",
        imageUrl,
        newPublicId,
        deletionResult, // This object now contains detailed info
        // uploadResponse, // You can uncomment this if you need the full upload response
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("EditPic: Unhandled error in POST handler:", error);
    return NextResponse.json(
      { error: "Failed to replace image", detail: error.message || String(error) },
      { status: 500 }
    );
  }
}