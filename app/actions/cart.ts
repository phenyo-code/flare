"use server";

import { prisma } from "../lib/db/prisma";

export async function createCartItemAction(cartId: string, productId: string, sizeId: string) {
    if (!cartId || !productId || !sizeId) {
        throw new Error("Product ID, Cart ID, and Size ID are required.");
    }

    // Check if the product with the same size already exists in the cart
    const existingCartItem = await prisma.cartItem.findFirst({
        where: {
            cartId,
            productId,
            sizeId,
        },
    });

    if (existingCartItem) {
        // If item exists, update the quantity by incrementing it
        await prisma.cartItem.update({
            where: { id: existingCartItem.id },
            data: { quantity: existingCartItem.quantity + 1 },  // Increase quantity
        });
    } else {
        // Create a new cart item if it doesn't exist
        await prisma.cartItem.create({
            data: {
                cartId,
                productId,
                sizeId, // Store the selected size
                quantity: 1, // Default quantity to 1
            },
        });
    }
}

export async function removeCartItemAction(cartItemId: string) {
    await prisma.cartItem.delete({
        where: { id: cartItemId },
    });
}
