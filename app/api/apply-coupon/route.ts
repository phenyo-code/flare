// app/api/apply-coupon/route.ts
import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { couponCode, userId, total } = await req.json();

  if (!couponCode || !userId || !total) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
    if (!coupon) return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }
    if (coupon.maxUses && coupon.uses >= coupon.maxUses) {
      return NextResponse.json({ error: "Coupon max uses reached" }, { status: 400 });
    }
    if (coupon.userId && coupon.userId !== userId) {
      return NextResponse.json({ error: "This coupon is not valid for your account" }, { status: 400 });
    }
    if (coupon.minOrderValue && total < coupon.minOrderValue) {
      return NextResponse.json({ error: `Order must be at least R${coupon.minOrderValue}` }, { status: 400 });
    }

    const discount = coupon.discountType === "percentage" ? Math.round((total * coupon.discountValue) / 100) : coupon.discountValue;
    const newTotal = Math.max(total - discount, 0);

    return NextResponse.json({ success: true, discount, newTotal, couponId: coupon.id });
  } catch (error) {
    console.error("Error applying coupon:", error);
    return NextResponse.json({ error: "Failed to apply coupon" }, { status: 500 });
  }
}