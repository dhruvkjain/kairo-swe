import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //Save user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "DEVELOPER",
      },
    });

    //Generate verification token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: user.email!,
        token,
        expires,
      },
    });

    // Send verification email
    const transporter = nodemailer.createTransport({
      service:'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_URL}/api/verify?token=${token}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email!,
      subject: "Verify your email",
      html: `<p>Hi ${user.name},</p>
             <p>Click below to verify your email:</p>
             <a href="${verificationUrl}">Verify Email</a>`,
    });

    return NextResponse.json({ message: "Registration successful! Check your email to verify your account." });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}

// import { type NextRequest, NextResponse } from "next/server"

// export async function POST(request: NextRequest) {
//   try {
//     const { email, password, name } = await request.json()

//     // Basic validation
//     if (!email || !password || !name) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
//     }

//     // In a real app, we would:
//     // 1. Hash the password
//     // 2. Save to database
//     // 3. Send verification email

//     // For demo purposes, we'll just return success
//     const user = {
//       id: Date.now().toString(),
//       email,
//       name,
//     }

//     return NextResponse.json({ message: "User created successfully", user }, { status: 201 })
//   } catch (error) {
//     return NextResponse.json({ error: "Internal server error" }, { status: 500 })
//   }
// }
