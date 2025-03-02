"use server";

import { prisma } from "@/lib/db/prisma";

export async function updateCartQuantity(cartItemId: string, quantity: number) {
  if (quantity < 1) return { error: "Quantity must be at least 1" };

  try {
    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return { success: true, updatedItem };
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return { error: "Failed to update cart quantity" };
  }
}