// actions/PlaceOrder.tsx
"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import { generateCouponForOrder } from "./couponUtils";

// Function to generate a unique tracking number starting with "FLARE"
async function generateUniqueTrackingNumber(): Promise<string> {
  const prefix = "FLARE";
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase(); // Generates a 6-character random string
  const trackingNumber = `${prefix}-${randomPart}`; // e.g., "FLARE-7K9P2M"

  // Check if this tracking number already exists
  const existingOrder = await prisma.order.findFirst({
    where: { trackingNumber },
  });

  // If it exists, recursively generate a new one (rare case)
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

  if (!shippingName || !shippingEmail || !shippingAddress || !shippingPhoneNumber) {
    throw new Error("Please fill in all fields.");
  }

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("You must be logged in to place an order.");
  }

  const cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
    include: { items: { include: { size: true, product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  let totalPrice = cart.items.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
  let discountApplied = 0;
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

  // Generate a unique tracking number
  const trackingNumber = await generateUniqueTrackingNumber();

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      shippingName,
      shippingEmail,
      shippingAddress,
      shippingPhoneNumber,
      status: "order submitted",
      totalPrice,
      couponId,
      discountApplied,
      trackingNumber, // Add the tracking number here
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product?.price || 0,
          sizeId: item.sizeId,
        })),
      },
    },
  });

  await Promise.all(
    cart.items.map(async (item) => {
      await prisma.size.update({
        where: { id: item.sizeId },
        data: { quantity: { decrement: item.quantity }, sold: { increment: item.quantity } },
      });
    })
  );

  await prisma.cart.update({
    where: { id: cart.id },
    data: { items: { deleteMany: {} } },
  });

  await generateCouponForOrder(session.user.id);

  redirect("/order-success?status=order submitted");
}