import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"

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
              role: credentials.role as any,
            },
          });
        } else {
          // If user exists, validate password (TODO: implement password check)
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
        (token as any).id = (user as any).id;
        (token as any).role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const dbUser = (await prisma.user.findUnique({
          where: { email: session.user.email! },
          select: { id: true, role: true },
        })) as { id?: string | null; role?: string | null } | null;

        const userAny = session.user as any;
        userAny.id = dbUser?.id;
        userAny.role = dbUser?.role;
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
