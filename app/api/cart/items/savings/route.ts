// app/api/cart/savings/route.ts
import { prisma } from "../../../../lib/db/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/options";

export async function GET(req: Request) {
  try {
    // Get user session
    const session = await getServerSession({ req, ...authOptions });

    // If no user session, return savings as 0
    if (!session?.user?.id) {
      return new Response(
        JSON.stringify({ savings: 0, message: "Not logged in" }),
        { status: 200 }
      );
    }

    // Fetch the user's cart with items and product details
    const cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true, // Include product details for price
          },
        },
      },
    });

    // If no cart or no items, return savings as 0
    if (!cart || !cart.items.length) {
      return new Response(
        JSON.stringify({ savings: 0, message: "Cart is empty" }),
        { status: 200 }
      );
    }

    // Calculate subtotal (before discounts)
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Calculate tiered discount (based on CartTotal.tsx logic)
    let tieredDiscountPercentage = 0;
    if (subtotal >= 3000) {
      tieredDiscountPercentage = 15;
    } else if (subtotal >= 2500) {
      tieredDiscountPercentage = 10;
    } else if (subtotal >= 2000) {
      tieredDiscountPercentage = 5;
    }
    const tieredDiscountAmount =
      tieredDiscountPercentage > 0
        ? (subtotal * tieredDiscountPercentage) / 100
        : 0;

    // Calculate coupon discount (currently not linked to Cart, so placeholder logic)
    // For now, assume no coupon is applied directly to Cart; adjust if added later
    let couponDiscount = 0;
    // Example future integration: Fetch active user-specific coupon
    const activeCoupon = await prisma.coupon.findFirst({
      where: {
        userId: session.user.id,
        expiresAt: { gt: new Date() }, // Not expired
        uses: { lt: prisma.coupon.fields.maxUses }, // Has uses left
      },
    });
    if (activeCoupon) {
      if (activeCoupon.discountType === "percentage") {
        couponDiscount = (subtotal * activeCoupon.discountValue) / 100;
      } else if (activeCoupon.discountType === "fixed") {
        couponDiscount = activeCoupon.discountValue;
      }
      // Apply minimum order value check if exists
      if (activeCoupon.minOrderValue && subtotal < activeCoupon.minOrderValue) {
        couponDiscount = 0;
      }
    }

    // Total savings
    const totalSavings = tieredDiscountAmount + couponDiscount;

    // Detailed response
    const savingsDetails = {
      subtotal: subtotal.toFixed(2),
      tieredDiscount: tieredDiscountAmount.toFixed(2),
      couponDiscount: couponDiscount.toFixed(2),
      totalSavings: totalSavings.toFixed(2),
      couponCode: activeCoupon?.code || null, // Optional: Include applied coupon code
    };

    return new Response(JSON.stringify(savingsDetails), { status: 200 });
  } catch (error) {
    console.error("Error fetching cart savings:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch cart savings" }),
      { status: 500 }
    );
  }
}