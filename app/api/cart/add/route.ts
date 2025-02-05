import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db/prisma";

export async function POST(req: Request) {
    try {
        // Log request to debug
        console.log("Received request to add to cart");

        const body = await req.json();
        console.log("Parsed request body:", body);

        const { cartId, productId, selectedSizeId } = body; // Expecting selectedSizeId

        if (!cartId || !productId || !selectedSizeId) {
            console.error("Missing cartId, productId, or selectedSizeId", { cartId, productId, selectedSizeId });
            return NextResponse.json({ message: "Product ID, Cart ID, and Size ID are required." }, { status: 400 });
        }

        // Check if the product with the same size already exists in the cart
        const existingCartItem = await prisma.cartItem.findFirst({
            where: {
                cartId,
                productId,
                sizeId: selectedSizeId,
            },
        });

        if (existingCartItem) {
            // If item exists, update the quantity by incrementing it
            const updatedCartItem = await prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + 1 },  // Increase quantity
            });

            console.log("Updated cart item:", updatedCartItem);

            return NextResponse.json({ success: true, cartItem: updatedCartItem }, { status: 200 });
        } else {
            // Create a new cart item if it doesn't exist
            const newCartItem = await prisma.cartItem.create({
                data: {
                    cartId,
                    productId,
                    sizeId: selectedSizeId, // Store the selected size
                    quantity: 1, // Default quantity to 1
                },
            });

            console.log("Added to cart:", newCartItem);

            return NextResponse.json({ success: true, cartItem: newCartItem }, { status: 200 });
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
