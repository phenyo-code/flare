import { prisma } from "../../../../lib/db/prisma";
import { getServerSession } from "next-auth/next"; // Correct import
import { authOptions } from "../../../auth/[...nextauth]/options";

export async function GET(req: Request) {
  try {
    // Get user session
    const session = await getServerSession({ req, ...authOptions });

    // If no user session, return count as 0
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ count: 0, message: "Not logged in" }), { status: 200 });
    }

    // Fetch the user's cart with items including their size information
    const cart = await prisma.cart.findFirst({
      where: { userId: session.user.id }, // Get cart for the logged-in user
      include: {
        items: {
          include: { size: true }, // Include the size of each cart item
        },
      },
    });

    // Get the cart item count
    const count = cart?.items?.length || 0;

    // Optionally include quantities in the response
    const cartItems = cart?.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      size: item.size.size, // Assuming 'size' is an object with the 'size' property
    })) || [];

    return new Response(JSON.stringify({ count, cartItems }), { status: 200 });
  } catch (error) {
    console.error("Error fetching cart item count:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch cart item count" }),
      { status: 500 }
    );
  }
}
