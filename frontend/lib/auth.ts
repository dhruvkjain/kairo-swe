import { cookies } from "next/headers"
import prisma from "@/lib/prisma"

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get("sessionToken")?.value

    if (!sessionToken) return null

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    })

    if (!session || new Date(session.expires) < new Date()) {
      return null
    }

    return session.user
  } catch (error) {
    console.error("[v0] Error getting current user:", error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Unauthorized: Please log in to continue")
  }
  return user
}
