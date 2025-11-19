import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import crypto from "node:crypto";
import nodemailer from "nodemailer";
import { Role, Gender } from "@prisma/client"; // Import Enums for Type Safety

export async function POST(req: NextRequest) {
  console.log("running registration");

  try {
    // 1. Read body once
    const body = await req.json();
    const { name, email, password, role, gender, companyId } = body;

    // 2. Validate fields
    if (!name || !email || !password || !role || !gender) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // 3. Normalize values & Type Cast
    const normalizedRole = role.toUpperCase();
    const normalizedGender = gender.toUpperCase();

    // Validate Role String specifically against Enum values to satisfy TS
    if (normalizedRole !== "APPLICANT" && normalizedRole !== "RECRUITER") {
        return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }
    
    // Validate Gender String specifically
    if (!["MALE", "FEMALE", "OTHER"].includes(normalizedGender)) {
        return NextResponse.json({ error: "Invalid gender." }, { status: 400 });
    }

    let foundCompanyId: string | null = null; 

    // 4. Validate Role Specifics
    if (normalizedRole === "RECRUITER") {
      if (!companyId) {
        return NextResponse.json(
          { error: "Company ID is required for recruiters." },
          { status: 400 }
        );
      }

      // Find Auth record based on Login ID provided by user
      const companyAuthRecord = await prisma.companyAuth.findUnique({
        where: { loginId: companyId },
        select: { companyId: true } // We need the actual Company UUID
      });

      if (!companyAuthRecord) {
        return NextResponse.json(
          { error: "Invalid Company ID credentials." },
          { status: 400 }
        );
      }

      // Store the actual UUID
      foundCompanyId = companyAuthRecord.companyId;
    }

    // 5. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered." },
        { status: 400 }
      );
    }

    // 6. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 7. Create user
    // We cast normalizedRole and normalizedGender to their specific Enum types
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: normalizedRole as Role, 
        gender: normalizedGender as Gender,
      },
    });

    console.log("User created:", user.id);

    // 8. Create related profile
    if (normalizedRole === "APPLICANT") {
      await prisma.applicant.create({
        data: { userId: user.id },
      });
      console.log("Applicant profile created");
    }

    if (normalizedRole === "RECRUITER" && foundCompanyId) {
      await prisma.recruiter.create({
        data: {
          userId: user.id,
          companyId: foundCompanyId, // Use the actual Company UUID found in step 4
        },
      });
      console.log("Recruiter profile created linked to Company UUID:", foundCompanyId);
    }

    // 9. Create a verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await prisma.verificationToken.create({
      data: {
        identifier: user.email!, // Non-null assertion
        token,
        expires,
      },
    });

    // 10. Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email!,
      subject: "Verify your email",
      html: `
        <p>Hi ${user.name},</p>
        <p>Welcome to Kairo!</p>
        <p>Please verify your email:</p>
        <a href="${verificationUrl}">Verify Email</a>
      `,
    });

    return NextResponse.json({
      message: "Registration successful! Check your email to verify your account.",
    });

  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}