import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

function generateLoginId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "COMP-";
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, industry, website, description, password } = body;

    if (!name || !password) {
      return NextResponse.json({ error: "name and password are required" }, { status: 400 });
    }


    const company = await prisma.company.create({
      data: { name, industry: industry ?? null, website: website ?? null, description: description ?? null },
    });

    
    const hashed = await bcrypt.hash(password, 10);
    let auth = null;
    let createdLoginId: string | null = null;
    const maxAttempts = 5;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const loginId = generateLoginId();
      try {
        auth = await prisma.companyAuth.create({
          data: { companyId: company.id, loginId, password: hashed },
        });
         
        createdLoginId = loginId;
        break;
      } catch (err: any) {
         
        if (err?.code === "P2002") continue;
        throw err;
      }
    }
    if (!auth) {
      return NextResponse.json({ error: "Could not generate unique company login ID" }, { status: 500 });
    }

    return NextResponse.json({ message: "Company registered", company: { id: company.id, name: company.name }, loginId: createdLoginId }, { status: 201 });
  } catch (err) {
    console.error("registerCompany error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
