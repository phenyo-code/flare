"use server";

import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";

export async function createTempOrder() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) throw new Error("Unauthorized");

  const cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
    include: { items: { include: { product: true, size: true } } },
  });

  if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

  const totalPrice = cart.items.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      userId: session.user.id,
      shippingName: "", // Placeholder
      shippingEmail: "", // Placeholder
      shippingAddress: "", // Placeholder
      shippingPhoneNumber: "", // Placeholder
      status: "pending",
      totalPrice,
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

  return order.id;
}