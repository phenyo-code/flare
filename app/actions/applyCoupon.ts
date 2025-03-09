// app/actions/applyCoupon.ts
"use server";

import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

export async function applyCoupon(orderId: string, couponCode: string, userId: string) {
  // Validate orderId
  if (!orderId || typeof orderId !== "string") {
    return { success: false, error: "Invalid or missing order ID" };
  }

  // Validate couponCode and userId
  if (!couponCode || typeof couponCode !== "string") {
    return { success: false, error: "Invalid or missing coupon code" };
  }
  if (!userId || typeof userId !== "string") {
    return { success: false, error: "Invalid or missing user ID" };
  }

  // Check if the coupon exists and is valid
  const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
  if (
    !coupon ||
    (coupon.expiresAt && coupon.expiresAt < new Date()) ||
    coupon.uses >= coupon.maxUses ||
    (coupon.userId && coupon.userId !== userId)
  ) {
    return { success: false, error: "Invalid or expired coupon" };
  }

  // Fetch the order
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    return { success: false, error: "Order not found" };
  }

  // Calculate the new total with discount
  const subtotal = order.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const discount = coupon.discountType === "percentage"
    ? Math.round((subtotal * coupon.discountValue) / 100)
    : coupon.discountValue;
  const deliveryFee = subtotal < 1000 ? 100 : 0;
  const newTotal = Math.max(subtotal - discount + deliveryFee, 0);

  // Update the order with coupon details
  await prisma.order.update({
    where: { id: orderId },
    data: {
      couponId: coupon.id,
      discountApplied: discount,
      totalPrice: newTotal,
    },
  });

  // Increment coupon usage
  await prisma.coupon.update({
    where: { id: coupon.id },
    data: { uses: coupon.uses + 1 },
  });

  revalidatePath("/cart"); // Trigger client-side refresh
  return { success: true, discount, newTotal };
}