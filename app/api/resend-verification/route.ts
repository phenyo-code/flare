import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { sendVerificationEmail } from "@/lib/email";

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
      // Don't reveal if the email exists for security
      return NextResponse.redirect(
        new URL("/resend-verification-sent?status=success", process.env.NEXTAUTH_URL || "http://localhost:3000")
      );
    }

    if (user.emailVerified) {
      return NextResponse.redirect(
        new URL("/resend-verification-sent?status=already_verified", process.env.NEXTAUTH_URL || "http://localhost:3000")
      );
    }

    // Generate a new token
    const newToken = uuidv4();
    await prisma.user.update({
      where: { email },
      data: { verificationToken: newToken },
    });

    // Send the email
    await sendVerificationEmail(email, newToken);

    // Redirect to a confirmation page
    return NextResponse.redirect(
      new URL("/resend-verification-sent?status=success", process.env.NEXTAUTH_URL || "http://localhost:3000")
    );
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.redirect(
      new URL("/resend-verification-sent?status=error", process.env.NEXTAUTH_URL || "http://localhost:3000")
    );
  }
}