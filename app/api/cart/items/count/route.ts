import { prisma } from "../../../../lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(req: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);

    // If no user session, return count as 0
    if (!session || !session.user) {
      return new Response(JSON.stringify({ count: 0, message: "Not logged in" }), { status: 200 });
    }

    // Fetch the user's cart
    const cart = await prisma.cart.findFirst({
      where: {
        userId: session.user.id, // Get cart for the logged-in user
      },
      include: {
        items: true,
      },
    });

    // Get the cart item count
    const count = cart ? cart.items.length : 0;

    return new Response(JSON.stringify({ count }), { status: 200 });
  } catch (error) {
    console.error("Error fetching cart item count:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch cart item count" }),
      { status: 500 }
    );
  }
}
