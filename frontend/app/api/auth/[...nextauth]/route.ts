import NextAuth from "next-auth"
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials: any): Promise<any> {
        if (!credentials?.email || !credentials?.password || !credentials?.role) return null

        let user = await prisma.user.findUnique({ where: { email: credentials.email } })

        if (!user) {
          user = await prisma.user.create({ data: { email: credentials.email, role: credentials.role as any } })
        } else {
          // TODO: implement password verification
          return null
        }
        return user
      },
    }),
    GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! }),
  ],
  callbacks: {
    async signIn({ user, account }: any) {
      if (account?.provider === "google") {
        await prisma.user.findUnique({ where: { email: user.email! } })
      }
      return true
    },
    async jwt({ token, user }: any) {
      if (user) {
        ;(token as any).id = (user as any).id
        ;(token as any).role = (user as any).role
      }
      return token
    },
    async session({ session }: any) {
      if (session.user?.email) {
        const dbUser = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true, role: true } })
        const userAny = session.user as any
        userAny.id = dbUser?.id
        userAny.role = dbUser?.role
      }
      return session
    },
  },
  session: { strategy: "jwt" },
  events: { async signIn(message: any) { console.log("User signed in:", message.user?.email) } },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST, authOptions }
