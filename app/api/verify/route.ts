// app/api/verify/route.ts
import { prisma } from "@/lib/db/prisma"; // Adjust path if needed
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Update user to mark email as verified and clear the token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null, // Clear the token after verification
      },
    });

    // Redirect to login with a success message
    return NextResponse.redirect(new URL("/login?verified=true", process.env.NEXTAUTH_URL));
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}