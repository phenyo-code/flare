// actions/applyCoupon.ts
"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function applyCoupon(orderId: string, couponCode: string, userId: string) {
  const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
  if (
    !coupon ||
    coupon.expiresAt < new Date() ||
    coupon.uses >= coupon.maxUses ||
    (coupon.userId && coupon.userId !== userId)
  ) {
    return { success: false, error: "Invalid or expired coupon" };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });
  if (!order) {
    return { success: false, error: "Order not found" };
  }

  const subtotal = order.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const discount = coupon.discountType === "percentage"
    ? Math.round((subtotal * coupon.discountValue) / 100)
    : coupon.discountValue;
  const deliveryFee = subtotal < 1000 ? 100 : 0;
  const newTotal = Math.max(subtotal - discount + deliveryFee, 0);

  await prisma.order.update({
    where: { id: orderId },
    data: {
      couponId: coupon.id,
      discountApplied: discount,
      totalPrice: newTotal,
    },
  });

  await prisma.coupon.update({
    where: { id: coupon.id },
    data: { uses: coupon.uses + 1 },
  });

  revalidatePath("/cart"); // Trigger client-side refresh
  return { success: true, discount, newTotal };
}