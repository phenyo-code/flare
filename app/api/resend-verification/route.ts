// app/api/resend-verification/route.ts
"use server";

import { prisma } from "@/lib/db/prisma"; // Adjust path
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "@/lib/email"; // Adjust path

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "No email provided" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: "Email already verified" }, { status: 400 });
    }

    // Generate a new token
    const newToken = uuidv4();
    await prisma.user.update({
      where: { email },
      data: { verificationToken: newToken },
    });

    // Send the email
    await sendVerificationEmail(email, newToken);

    return NextResponse.redirect(new URL(`/verify-email?email=${encodeURIComponent(email)}`, process.env.NEXTAUTH_URL));
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}