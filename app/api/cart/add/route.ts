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

        // Add item to cart with sizeId
        const cartItem = await prisma.cartItem.create({
            data: {
                cartId,
                productId,
                sizeId: selectedSizeId, // Include the selected size
                quantity: 1,
            },
        });

        console.log("Added to cart:", cartItem);

        return NextResponse.json({ success: true, cartItem }, { status: 200 });
    } catch (error) {
        console.error("Error adding to cart:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
