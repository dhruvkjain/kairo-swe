import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Basic validation
    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real app, we would:
    // 1. Hash the password
    // 2. Save to database
    // 3. Send verification email

    // For demo purposes, we'll just return success
    const user = {
      id: Date.now().toString(),
      email,
      name,
    }

    return NextResponse.json({ message: "User created successfully", user }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
