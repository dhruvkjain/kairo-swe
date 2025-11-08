import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import crypto from "node:crypto";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  console.log("runnig");
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    // validate role
    const normalizedRole = role.toUpperCase();
    if (normalizedRole !== "APPLICANT" && normalizedRole !== "RECRUITER") {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    // check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered." }, { status: 400 });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: normalizedRole,
      },
    });

    console.log("User created:", user);

    // create role-specific profile
    if (normalizedRole === "APPLICANT") {
      await prisma.applicant.create({
        data: {
          userId: user.id,
        },
      });
      console.log("Applicant profile created");
    } else if (normalizedRole === "RECRUITER") {
      await prisma.recruiter.create({
        data: {
          userId: user.id,
        },
      });
      console.log("Recruiter profile created");
    }

    // generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await prisma.verificationToken.create({
      data: {
        identifier: user.email!,
        token,
        expires,
      },
    });

    // send verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
    });

    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email!,
      subject: "Verify your email",
      html: `<p>Hi ${user.name},</p>
             <p>Welcome to Kairo!</p>
             <p>Click below to verify your email:</p>
             <a href="${verificationUrl}">Verify Email</a>`,
    });

    return NextResponse.json({ message: "Registration successful! Check your email to verify your account." });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}

