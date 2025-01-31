// lib/cart-actions.ts
import { prisma } from './db/prisma';  // Ensure you import Prisma

// This function is the server action that will handle adding items to the cart
export async function addProductToCart(cartId: string, productId: string) {
    // Check if cart exists
    const cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: { items: true },
    });

    if (!cart) {
        throw new Error("Cart not found");
    }

    // Create a cart item
    const cartItem = await prisma.cartItem.create({
        data: {
            cartId: cart.id,
            productId,
            quantity: 1, // Default quantity, can adjust as needed
        },
    });

    return cartItem;
}
