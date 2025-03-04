// app/api/check-verification/route.ts
import { prisma } from "@/lib/db/prisma"; // Adjust path
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "No email provided" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { emailVerified: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ verified: user.emailVerified });
  } catch (error) {
    console.error("Check verification error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}