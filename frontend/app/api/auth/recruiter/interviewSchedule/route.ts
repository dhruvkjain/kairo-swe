import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const recruiterId = searchParams.get('recruiterId');

    if (!recruiterId) {
      return NextResponse.json({ error: 'recruiterId is required' }, { status: 400 });
    }

    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: recruiterId },
    });

    if (!recruiter) {
      return NextResponse.json({ error: 'Recruiter not found' }, { status: 404 });
    }

    const internships = await prisma.internship.findMany({
      where: { recruiterId: recruiter.id },
      select: { id: true },
    });

    const internshipIds = internships.map((internship) => internship.id);

    if (internshipIds.length === 0) {
      return NextResponse.json({ error: 'No internships found for this recruiter' }, { status: 404 });
    }

    // Corrected: selectInterview is moved into where clause properly
    const data = await prisma.internshipApplication.findMany({
      where: {
        internshipId: { in: internshipIds },
        status : "Interview",
      },
      select: {
        id:true,
        resumeData: true,
        interviewMode: true,
        interviewLocation: true,
        interviewDate: true,
        interviewTime: true,
      },
    });

    if (data.length === 0) {
      return NextResponse.json({ error: 'No interview selected or applicants found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Error retrieving internship application:', error);
    return NextResponse.json({ error: 'Failed to retrieve data' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const applicationId = searchParams.get("applicantId");

    if (!applicationId) {
      return NextResponse.json({ error: "applicantId is required" }, { status: 400 });
    }

    const body = await req.json();
    const {
      interviewMode,
      interviewLocation,
      interviewDate,
      interviewTime,
    } = body;

    if (
      interviewMode === undefined &&
      interviewLocation === undefined &&
      interviewDate === undefined &&
      interviewTime === undefined
    ) {
      return NextResponse.json({ error: "No update fields provided" }, { status: 400 });
    }

    const updateData: Record<string, any> = {
      status: "Interview",
    };

    if (interviewMode !== undefined) updateData.interviewMode = interviewMode;
    if (interviewLocation !== undefined) updateData.interviewLocation = interviewLocation;
    if (interviewDate !== undefined)
      updateData.interviewDate = interviewDate;
    if (interviewTime !== undefined)
      updateData.interviewTime = interviewTime || null;

    // 1. Update the application and retrieve necessary data for the email
    const updatedApplication = await prisma.internshipApplication.update({
      where: { id: applicationId },
      data: updateData,
      include: {
        applicant: { 
          select: {
            email: true,
            name: true,
          }
        },
        internship: {
          select: {
            title: true,
          }
        }
      }
    });
    
    // --- START: Local Email Sending Logic ---
    
    const applicantEmail = updatedApplication.applicant.email!;
    const applicantName = updatedApplication.applicant.name || 'Applicant';
    const internshipTitle = updatedApplication.internship.title;
    const mode = updatedApplication.interviewMode || 'Unspecified';
    const location = updatedApplication.interviewLocation;
    const date = updatedApplication.interviewDate;
    const time = updatedApplication.interviewTime;

    // 2. Create the transporter locally
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // 3. Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: applicantEmail,
      subject: `Interview Scheduled for your ${internshipTitle} Internship Application`,
      html: `
        <html>
        <body style="font-family: sans-serif; line-height: 1.6;">
          <h2>Hello ${applicantName},</h2>
          <p>We are pleased to inform you that your interview for the <b>${internshipTitle}</b> internship has been scheduled!</p>
          
          <div style="border: 1px solid #ddd; padding: 15px; margin: 20px 0; border-radius: 8px;">
            <h3 style="margin-top: 0;">Interview Details</h3>
            <p><strong>Internship:</strong> ${internshipTitle}</p>
            <p><strong>Mode:</strong> ${mode.toUpperCase()}</p>
            ${date ? `<p><strong>Date:</strong> ${date}</p>` : ''}
            ${time ? `<p><strong>Time:</strong> ${time}</p>` : ''}
            ${location ? `<p><strong>Location/Link:</strong> ${location}</p>` : ''}
          </div>
          
          <p>Please be ready a few minutes before the scheduled time. If you have any questions, please reply to this email.</p>
          <p>Best regards,</p>
          <p>The Recruitment Team</p>
        </body>
        </html>
      `,
    });
    
    // --- END: Local Email Sending Logic ---

    return NextResponse.json({
      success: true,
      message: "Interview schedule updated and email sent successfully"
    });

  } catch (error) {
    console.error('Error updating interview or sending email:', error);
    return NextResponse.json(
      { error: "Failed to update interview or send email" }, 
      { status: 500 }
    );
  }
}
