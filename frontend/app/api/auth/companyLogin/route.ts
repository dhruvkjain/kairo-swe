import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { loginId, password } = body;

    if (!loginId || !password) {
      return NextResponse.json({ error: "loginId and password are required" }, { status: 400 });
    }

    const auth = await (prisma as any).companyAuth.findUnique({ where: { loginId }, include: { company: true } });
    if (!auth) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const match = await bcrypt.compare(password, auth.password);
    if (!match) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Authenticated. Return basic company info. Frontend should create session/token as needed.
    return NextResponse.json({ message: "Authenticated", company: { id: auth.company.id, name: auth.company.name } }, { status: 200 });
  } catch (err) {
    console.error("companyLogin error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
