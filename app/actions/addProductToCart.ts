"use server";

import { prisma } from "@/lib/db/prisma";
import { ObjectId } from "mongodb";

export async function addProductToCart(cartId: string, productId: string, sizeId: string) {
  if (!cartId || !productId || !sizeId) {
    throw new Error("Invalid cartId, productId, or sizeId");
  }

  const cartObjectId = new ObjectId(cartId);
  const productObjectId = new ObjectId(productId);
  const sizeObjectId = new ObjectId(sizeId);

  const cart = await prisma.cart.findUnique({
    where: { id: cartObjectId.toString() },
    include: { items: true },
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const size = await prisma.size.findUnique({
    where: { id: sizeObjectId.toString() },
  });

  if (!size) {
    throw new Error("Size not found");
  }

  const existingCartItem = cart.items.find(
    (item) =>
      item.productId.toString() === productObjectId.toString() &&
      item.sizeId.toString() === sizeObjectId.toString()
  );

  if (existingCartItem) {
    await prisma.cartItem.update({
      where: { id: existingCartItem.id },
      data: { quantity: existingCartItem.quantity + 1 },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cartObjectId.toString(),
        productId: productObjectId.toString(),
        quantity: 1,
        sizeId: sizeObjectId.toString(),
      },
    });
  }

  return { success: true };
}