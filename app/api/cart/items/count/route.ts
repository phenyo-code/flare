import { prisma } from "../../../../lib/db/prisma";

export async function GET(req: Request) {
  try {
    const cart = await prisma.cart.findFirst({
      where: {
        // Optionally add conditions to find a specific user's cart
      },
      include: {
        items: true,
      },
    });

    const count = cart ? cart.items.length : 0;

    return new Response(JSON.stringify({ count }), { status: 200 });
  } catch (error) {
    console.error("Error fetching cart item count:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch cart item count" }), { status: 500 });
  }
}
