import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db/prisma";

export async function POST(req: Request) {
    try {
        // Log request to debug
        console.log("Received request to add to cart");

        const body = await req.json();
        console.log("Parsed request body:", body);

        const { cartId, productId } = body;

        if (!cartId || !productId) {
            console.error("Missing cartId or productId", { cartId, productId });
            return NextResponse.json({ message: "Product ID and Cart ID are required." }, { status: 400 });
        }

        // Add item to cart
        const cartItem = await prisma.cartItem.create({
            data: {
                cartId,
                productId,
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


export async function GET() {
    try {
      // Fetch the first cart without any userId filter
      const cart = await prisma.cart.findFirst({
        include: {
          items: true, // Include related cart items
        },
      });
  
      // If cart is not found, return an empty cart with no items
      if (!cart || !cart.items) {
        return new Response(JSON.stringify({ items: [] }), { status: 200 });
      }
  
      // Return the cart with the items
      return new Response(JSON.stringify(cart), { status: 200 });
    } catch (error) {
      console.error('Error fetching cart:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch cart data' }), { status: 500 });
    }
  }
