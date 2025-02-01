import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../lib/db/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      async profile(profile) {
        let userRole = "user";
        // Define admin role based on a condition (e.g., email)
        if (profile?.email === "phenyokoikoi3@gmail.com") {
          userRole = "admin";
        }

        // Check if the user exists in the database
        let user = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (!user) {
          // If user doesn't exist, create a new one with role
          user = await prisma.user.create({
            data: {
              name: profile.name,
              email: profile.email,
              password: "", // Google users won't have passwords
              role: userRole, // Ensure that the user role is assigned here
            },
          });
        } else {
          // Ensure user’s role is updated if it’s changed outside of the login
          if (user.role !== userRole) {
            await prisma.user.update({
              where: { email: profile.email },
              data: { role: userRole },
            });
            user.role = userRole; // Update the role in the session response
          }
        }

        // Store or update the user's details in the google_users table
        await prisma.googleUser.upsert({
          where: { googleId: profile.sub },
          update: { name: profile.name, email: profile.email, image: profile.picture },
          create: {
            googleId: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            userId: user.id, // Link Google user to the main user account
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
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          throw new Error("Invalid email or password");
        }

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.image = user.image;
      }
      return token; // Ensure role is included in the JWT token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role; // Ensure role is included in the session
        session.user.image = token.image;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
