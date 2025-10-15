import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"
import { Role } from "@prisma/client"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.role) {
          return null;
        }

        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          // If user doesn’t exist, create new with role
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              role: credentials.role as Role,
            },
          });
        } else {
          // If user exists, just validate password
          return null;
        }

        // TODO: check hashed password instead of plain-text
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // If it's a new user from Google with no role, redirect them
      if (account?.provider === "google") {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        // if (!dbUser) {
        //   return false;
        // }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
          select: { id: true, role: true },
        })

        session.user.id = dbUser?.id;
        session.user.role = dbUser?.role;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  events: {
    async signIn(message) {
      console.log("User signed in:", message.user?.email);
    },
  },
})

export { handler as GET, handler as POST }
