import { NextRequest, NextResponse } from "next/server";
import { UploadClient } from "@uploadcare/upload-client";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

// --- Configuration ---
// The URL for your FastAPI resume parsing service (e.g., http://localhost:8000)
const RESUME_PARSER_URL = process.env.RESUME_PARSER_URL;

export async function POST(req: NextRequest) {
  try {
    // 0. Configuration Check and URL Construction
    if (!RESUME_PARSER_URL) {
        console.error("FATAL: RESUME_PARSER_URL environment variable is not set.");
        return NextResponse.json({ 
            error: "Server configuration error: Resume parser URL base missing." 
        }, { status: 500 });
    }
    
    const fullParserUrl = RESUME_PARSER_URL

    // 1. Authentication and Authorization
    const sessionToken = cookies().get("sessionToken")?.value;
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    const applicantId = session.user.applicant.id;

    // 2. Parse Request Body
    const body = await req.json();
    const { fileBase64, fileName } = body;

    if (!fileBase64 || typeof fileBase64 !== 'string') {
      return NextResponse.json({ error: "Missing or invalid file data" }, { status: 400 });
    }

    // Basic Base64 Validation
    try {
      const buffer = Buffer.from(fileBase64, 'base64');
      if (buffer.length === 0) {
        return NextResponse.json({ error: "Empty file data" }, { status: 400 });
      }
    } catch (error) {
      console.error('Invalid base64 data:', error);
      return NextResponse.json({ error: "Invalid file data format" }, { status: 400 });
    }

    // 3. Upload File to CDN (Uploadcare)
    const client = new UploadClient({
      publicKey: process.env.UPLOADCARE_PUBLIC_KEY!,
    });

    const fileBuffer = Buffer.from(fileBase64, "base64");
    const safeFileName = fileName || "upload.pdf";

    console.log(`INFO: Uploading file ${safeFileName} to Uploadcare...`);
    const uploadedFile = await client.uploadFile(fileBuffer, {
      fileName: safeFileName,
      store: true,
    });

    // Construct the CDN URL
    // FIX APPLIED: uploadedFile.cdnUrl already includes 'https://', so we use it directly
    // to prevent the double protocol seen in the error logs (https://https://...).
    const cdnUrl = `https://1a6knhurkj.ucarecd.net/${uploadedFile.uuid}/${fileName || "file.pdf"}`; // Clean URL by removing query parameters

    // 4. Call FastAPI Resume Parser
    console.log(`INFO: Calling external resume parser at ${fullParserUrl} with URL: ${cdnUrl}`);
    
    let parsedResumeData: any;
    try {
      const parserResponse = await fetch(fullParserUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // The FastAPI endpoint expects a JSON body with the URL, based on the `ResumeUrlRequest` model
        body: JSON.stringify({ url: cdnUrl }),
      });

      if (!parserResponse.ok) {
        // Log the error response from FastAPI for debugging
        const errorText = await parserResponse.text();
        console.error(`ERROR: FastAPI parser returned status ${parserResponse.status}. Body: ${errorText}`);
        // Re-throw the error to be caught by the outer catch block
        throw new Error(`Parser failed with status ${parserResponse.status}`);
      }

      parsedResumeData = await parserResponse.json();
      console.log('INFO: Resume parsing successful.');

    } catch (error) {
      console.error('ERROR: Failed to call or process FastAPI response:', error);
      // We can continue to update the resumeLink even if parsing fails, but log the issue.
      parsedResumeData = null; 
    }

    // 5. Update Applicant's Profile in Prisma/Supabase
    const updateData: any = { 
      resumeLink: cdnUrl,
    };

    if (parsedResumeData) {
      // Map parsed data fields based on the new schema:
      
      // Use the 'experience' field (most comprehensive text) for rawResumeText
      updateData.rawResumeText = parsedResumeData.rawResumeText || null;
      const phonenumber: string[] = [parsedResumeData.phone];
      updateData.phoneNumber = phonenumber || null;

      // Store the list of skills
      updateData.skills = Array.isArray(parsedResumeData.skills) ? parsedResumeData.skills : [];
      
      // NOTE: If your Applicant model has other fields (e.g., email, phone, college, course), 
      // you would map them here:
      // updateData.email = parsedResumeData.email || null;
      updateData.education = parsedResumeData.college || null;
    }

    await prisma.applicant.update({
      where: { id: applicantId },
      data: updateData,
    });

    // 6. Return Success Response
    return NextResponse.json({ 
      message: "File uploaded and parsing completed successfully", 
      fileUrl: cdnUrl,
      parsedData: parsedResumeData ? { 
        // Report back on the data fields we successfully mapped
        rawResumeTextLength: updateData.rawResumeText?.length || 0, 
        skillsCount: updateData.skills.length 
      } : "Parsing failed or returned no data."
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An unexpected error occurred during the upload process" }, { status: 500 });
  }
}