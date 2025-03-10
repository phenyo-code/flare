"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
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

export async function UpdateOrderShipping(formData: FormData, orderId: string) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("You must be logged in.");

  const shippingName = formData.get("shippingName")?.toString();
  const shippingEmail = formData.get("shippingEmail")?.toString();
  const shippingAddress = formData.get("shippingAddress")?.toString();
  const shippingPhoneNumber = formData.get("shippingPhoneNumber")?.toString();

  if (!shippingName || !shippingEmail || !shippingAddress || !shippingPhoneNumber) {
    throw new Error("Please fill in all shipping fields.");
  }

  if (!ObjectId.isValid(orderId)) {
    throw new Error("Invalid order ID.");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId, userId: session.user.id },
    include: { items: true },
  });

  if (!order || order.status !== "pending") {
    throw new Error("Order not found or already finalized.");
  }

  const cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
  });

  const trackingNumber = await generateUniqueTrackingNumber();

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: {
        shippingName,
        shippingEmail,
        shippingAddress,
        shippingPhoneNumber,
        status: "order submitted",
        trackingNumber,
      },
    });

    await Promise.all(
      order.items.map(async (item) => {
        await tx.size.update({
          where: { id: item.sizeId },
          data: { quantity: { decrement: item.quantity }, sold: { increment: item.quantity } },
        });
      })
    );

    if (cart) {
      await tx.cart.update({
        where: { id: cart.id },
        data: { items: { deleteMany: {} } },
      });
    }
  });

  redirect("/order-success?status=order submitted");
}