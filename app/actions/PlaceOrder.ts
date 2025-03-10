"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import { generateCouponForOrder } from "./couponUtils";
import { ObjectId } from "mongodb";

async function generateUniqueTrackingNumber(): Promise<string> {
  const prefix = "FLARE";
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  const trackingNumber = `${prefix}-${randomPart}`;

  const existingOrder = await prisma.order.findFirst({
    where: { trackingNumber },
  });

  if (existingOrder) {
    return generateUniqueTrackingNumber();
  }
  return trackingNumber;
}

export async function PlaceOrder(formData: FormData): Promise<void> {
  const shippingName = formData.get("shippingName")?.toString();
  const shippingEmail = formData.get("shippingEmail")?.toString();
  const shippingAddress = formData.get("shippingAddress")?.toString();
  const shippingPhoneNumber = formData.get("shippingPhoneNumber")?.toString();
  const couponCode = formData.get("couponCode")?.toString()?.toUpperCase();
  const orderId = formData.get("orderId")?.toString();

  if (!shippingName || !shippingEmail || !shippingAddress || !shippingPhoneNumber || !orderId) {
    throw new Error("Please fill in all fields and provide an order ID.");
  }

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("You must be logged in to place an order.");
  }

  if (!ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID.");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId, userId: session.user.id },
    include: { items: true },
  });

  if (!order) {
    throw new Error("Order not found.");
  }

  const cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
    include: { items: { include: { size: true, product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  let totalPrice = order.totalPrice; // Use the totalPrice from startCheckout
  let discountApplied = order.discountApplied || 0;
  let couponId: string | undefined;

  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({ where: { code: couponCode } });
    if (!coupon) throw new Error("Invalid coupon code.");

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) throw new Error("Coupon has expired.");
    if (coupon.maxUses && coupon.uses >= coupon.maxUses) throw new Error("Coupon max uses reached.");
    if (coupon.userId && coupon.userId !== session.user.id) throw new Error("This coupon is not valid for your account.");
    if (coupon.minOrderValue && totalPrice < coupon.minOrderValue) throw new Error(`Order must be at least R${coupon.minOrderValue}.`);

    discountApplied = coupon.discountType === "percentage" ? Math.round((totalPrice * coupon.discountValue) / 100) : coupon.discountValue;
    totalPrice = Math.max(totalPrice - discountApplied, 0);
    couponId = coupon.id;

    await prisma.coupon.update({
      where: { id: couponId },
      data: { uses: { increment: 1 } },
    });
  }

  const trackingNumber = await generateUniqueTrackingNumber();

  await prisma.$transaction(async (tx) => {
    // Update the existing order
    await tx.order.update({
      where: { id: orderId },
      data: {
        shippingName,
        shippingEmail,
        shippingAddress,
        shippingPhoneNumber,
        status: "order submitted",
        totalPrice,
        couponId,
        discountApplied,
        trackingNumber,
      },
    });

    // Update inventory
    await Promise.all(
      order.items.map(async (item) => {
        await tx.size.update({
          where: { id: item.sizeId },
          data: { quantity: { decrement: item.quantity }, sold: { increment: item.quantity } },
        });
      })
    );

    // Clear cart
    await tx.cart.update({
      where: { id: cart.id },
      data: { items: { deleteMany: {} } },
    });
  });

  await generateCouponForOrder(session.user.id);

  redirect("/order-success?status=order submitted");
}