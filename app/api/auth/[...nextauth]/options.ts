import { NextAuthOptions, User as NextAuthUser } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../lib/db/prisma";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string;
      email?: string;
      image?: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      async profile(profile) {
        let userRole = "user";
        if (profile?.email === "phenyokoikoi3@gmail.com") {
          userRole = "admin";
        }

        let user = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              name: profile.name,
              email: profile.email,
              password: "", // No password for Google users
              role: userRole,
              emailVerified: true, // Google users are auto-verified
            },
          });
        } else if (user.role !== userRole) {
          await prisma.user.update({
            where: { email: profile.email },
            data: { role: userRole },
          });
          user.role = userRole;
        }

        await prisma.googleUser.upsert({
          where: { googleId: profile.sub },
          update: { name: profile.name, email: profile.email, image: profile.picture },
          create: {
            googleId: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            userId: user.id,
          },
        });

        return {
          id: user.id,
          name: profile.name,
          email: profile.email,
          role: user.role,
          image: profile.picture,
        };
      },
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // Check if user exists and password matches
        if (!user || !user.password || !(await bcrypt.compare(credentials.password, user.password))) {
          throw new Error("Invalid email or password");
        }

        // Check if email is verified
        if (!user.emailVerified) {
          throw new Error("Please verify your email before signing in");
        }

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.image = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};