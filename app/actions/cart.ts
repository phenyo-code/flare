"use server";

import { prisma } from "../lib/db/prisma";

export async function createCartItemAction(cartId: string, productId: string, sizeId: string) {
    if (!cartId || !productId || !sizeId) {
        throw new Error("Product ID, Cart ID, and Size ID are required.");
    }

    // Create a new cart item with the selected size
    await prisma.cartItem.create({
        data: {
            cartId,
            productId,
            sizeId, // Store the selected size
            quantity: 1, // Default quantity to 1
        },
    });
}

export async function removeCartItemAction(cartItemId: string) {
    await prisma.cartItem.delete({
        where: { id: cartItemId },
    });
}
