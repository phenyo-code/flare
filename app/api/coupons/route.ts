// e.g., app/api/coupons/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const coupons = await prisma.coupon.findMany({
    where: {
      userId,
      expiresAt: { gt: new Date() }, // Not expired
      uses: { lt: prisma.coupon.fields.maxUses }, // Uses < maxUses
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(coupons);
}