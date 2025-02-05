import { prisma } from './db/prisma';  // Ensure you import Prisma
import { ObjectId } from 'mongodb';  // Import ObjectId from MongoDB

// This function is the server action that will handle adding items to the cart
export async function addProductToCart(cartId: string, productId: string, sizeId: string) {
    // Ensure that the cartId, productId, and sizeId are valid
    if (!cartId || !productId || !sizeId) {
        throw new Error("Invalid cartId, productId, or sizeId");
    }

    // Convert cartId, productId, and sizeId to ObjectId
    const cartObjectId = new ObjectId(cartId);
    const productObjectId = new ObjectId(productId);
    const sizeObjectId = new ObjectId(sizeId);

    // Check if the cart exists
    const cart = await prisma.cart.findUnique({
        where: { id: cartObjectId.toString() }, // Convert ObjectId to string for querying
        include: { items: true },
    });

    if (!cart) {
        throw new Error("Cart not found");
    }

    // Check if the product already exists in the cart with the same size
    const existingCartItem = cart.items.find(
        (item) => item.productId.toString() === productObjectId.toString() && item.sizeId.toString() === sizeObjectId.toString()
    );

    if (existingCartItem) {
        // If item exists, update the quantity by incrementing
        await prisma.cartItem.update({
            where: { id: existingCartItem.id },
            data: { quantity: existingCartItem.quantity + 1 },  // Increase quantity
        });
    } else {
        // Create a new cart item if it doesn't exist
        const cartItem = await prisma.cartItem.create({
            data: {
                cartId: cartObjectId.toString(),
                productId: productObjectId.toString(),
                quantity: 1, // Default quantity, can adjust as needed
                sizeId: sizeObjectId.toString(),
            },
        });
    }

    return { success: true };  // Return success
}
