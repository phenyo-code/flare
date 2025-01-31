"use server";

import { prisma } from "../lib/db/prisma";

export async function createCartItemAction(cartId: string, productId: string) {
    if (!cartId || !productId) {
        throw new Error("Product ID and Cart ID are required.");
    }

    await prisma.cartItem.create({
        data: {
            cartId,
            productId,
            quantity: 1, // Default quantity to 1
        },
    });
}


export async function removeCartItemAction(cartItemId: string) {
    await prisma.cartItem.delete({
        where: { id: cartItemId },
    });
}