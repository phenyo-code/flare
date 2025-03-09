"use server";

import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import Stripe from "stripe";

// Generate a unique tracking number starting with "FLARE"
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

// Generate a coupon for the user after a successful order
export async function generateCouponForOrder(userId: string): Promise<void> {
  console.log("generateCouponForOrder: Starting for userId:", userId);
  const code = `FLARE-USER${userId.slice(-6)}-ORD10`;
  const discountType = "percentage";
  const discountValue = 10;
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  const existing = await prisma.coupon.findUnique({ where: { code } });
  if (existing) {
    console.log(`generateCouponForOrder: Coupon ${code} already exists for user ${userId}`);
    return;
  }

  await prisma.coupon.create({
    data: {
      userId,
      code,
      discountType,
      discountValue,
      maxUses: 1,
      expiresAt,
    },
  });

  console.log(`generateCouponForOrder: Generated coupon ${code} for user ${userId} due to order completion`);
}

// Update existing order shipping details
export async function updateShippingDetails(formData: FormData, orderId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const shippingName = formData.get("shippingName")?.toString();
  const shippingEmail = formData.get("shippingEmail")?.toString();
  const shippingAddress = formData.get("shippingAddress")?.toString();
  const shippingPhoneNumber = formData.get("shippingPhoneNumber")?.toString();

  if (!shippingName || !shippingEmail || !shippingAddress) {
    throw new Error("Please fill in all required fields.");
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId, userId: session.user.id },
      data: {
        shippingName,
        shippingEmail,
        shippingAddress,
        shippingPhoneNumber: shippingPhoneNumber || null,
      },
    });
    return { success: true, order: updatedOrder };
  } catch (error) {
    console.error("Error updating shipping details:", error);
    throw new Error("Failed to update shipping details");
  }
}

// Create order and initiate Stripe checkout
export async function createOrderAndCheckout(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const shippingName = formData.get("shippingName")?.toString();
  const shippingEmail = formData.get("shippingEmail")?.toString();
  const shippingAddress = formData.get("shippingAddress")?.toString();
  const shippingPhoneNumber = formData.get("shippingPhoneNumber")?.toString();
  const couponCode = formData.get("couponCode")?.toString()?.toUpperCase();

  if (!shippingName || !shippingEmail || !shippingAddress || !shippingPhoneNumber) {
    throw new Error("Please fill in all required fields.");
  }

  const cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
    include: { items: { include: { size: true, product: true } } },
  });

  if (!cart || cart.items.length === 0) {
    throw new Error("Your cart is empty.");
  }

  // Calculate total price with discounts and delivery fee
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

    discountApplied = coupon.discountType === "percentage"
      ? Math.round((totalPrice * coupon.discountValue) / 100)
      : coupon.discountValue;
    totalPrice = Math.max(totalPrice - discountApplied, 0);
    couponId = coupon.id;
  }

  let tieredDiscountPercentage = 0;
  if (totalPrice >= 3000) tieredDiscountPercentage = 15;
  else if (totalPrice >= 2500) tieredDiscountPercentage = 10;
  else if (totalPrice >= 2000) tieredDiscountPercentage = 5;

  const tieredDiscountAmount = tieredDiscountPercentage > 0
    ? Math.round((totalPrice * tieredDiscountPercentage) / 100)
    : 0;
  totalPrice -= tieredDiscountAmount;

  const deliveryFee = totalPrice < 1000 ? 100 : 0;
  const finalPrice = Math.max(totalPrice + deliveryFee, 0);

  const trackingNumber = await generateUniqueTrackingNumber();
  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      shippingName,
      shippingEmail,
      shippingAddress,
      shippingPhoneNumber,
      status: "order submitted", 
      totalPrice: finalPrice,
      couponId,
      discountApplied: discountApplied + tieredDiscountAmount,
      trackingNumber,
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

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    ...cart.items.map((item) => ({
      price_data: {
        currency: "zar",
        product_data: { name: item.product.name },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    })),
    ...(deliveryFee > 0 ? [{
      price_data: {
        currency: "zar",
        product_data: { name: "Delivery Fee" },
        unit_amount: Math.round(deliveryFee * 100),
      },
      quantity: 1,
    }] : []),
    ...(discountApplied + tieredDiscountAmount > 0 ? [{
      price_data: {
        currency: "zar",
        product_data: { name: "Discount" },
        unit_amount: -Math.round((discountApplied + tieredDiscountAmount) * 100),
      },
      quantity: 1,
    }] : []),
  ];

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    metadata: {
      orderId: order.id,
      userId: session.user.id,
      couponCode: couponCode || "",
      discountApplied: (discountApplied + tieredDiscountAmount).toString(),
      couponId: couponId || "",
    },
  });

  redirect(stripeSession.url!);
}

// Confirm payment and finalize order, ensuring cart is cleared
export async function confirmOrderPayment(sessionId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
  if (stripeSession.payment_status !== "paid") {
    throw new Error("Payment not completed");
  }

  const orderId = stripeSession.metadata?.orderId;
  const userId = stripeSession.metadata?.userId;

  if (!orderId || userId !== session.user.id) {
    throw new Error("Invalid order or user mismatch");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { size: true } } },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  // Clear the cart and update inventory
  const cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
    include: { items: true },
  });

  if (cart) {
    // Update inventory
    await Promise.all(
      order.items.map(async (item) => {
        await prisma.size.update({
          where: { id: item.sizeId },
          data: {
            quantity: { decrement: item.quantity },
            sold: { increment: item.quantity },
          },
        });
      })
    );

    // Explicitly clear all cart items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    // Optional: Reset cart totals or other fields if your schema includes them
    await prisma.cart.update({
      where: { id: cart.id },
      data: {
        items: { deleteMany: {} }, // Redundant but ensures all items are gone
        // Add any other fields you want to reset, e.g., total: 0
      },
    });

    console.log(`Cart cleared for user ${userId} after order ${orderId}`);
  } else {
    console.warn(`No cart found for user ${userId} during order confirmation`);
  }

  // Update coupon usage if applicable
  const couponId = stripeSession.metadata?.couponId;
  if (couponId) {
    await prisma.coupon.update({
      where: { id: couponId },
      data: { uses: { increment: 1 } },
    });
  }

  // Update order status to confirmed
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "order submitted" },
  });

  // Generate coupon for this order
  await generateCouponForOrder(session.user.id);

  redirect("/order-success?status=order submitted");
}