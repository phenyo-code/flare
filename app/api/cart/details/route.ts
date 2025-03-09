import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: { select: { price: true } },
            size: { select: { id: true } },
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ items: [], subtotal: 0, savings: 0 }, { status: 200 });
    }

    const items = cart.items.map((item) => ({
      productId: item.productId,
      sizeId: item.sizeId,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const deliveryFee = 100;
    const freeDeliveryThreshold = 1000;
    const deliveryAdjustedSubtotal = subtotal < freeDeliveryThreshold ? subtotal + deliveryFee : subtotal;
    let tieredDiscountPercentage = 0;
    if (subtotal >= 3000) tieredDiscountPercentage = 15;
    else if (subtotal >= 2500) tieredDiscountPercentage = 10;
    else if (subtotal >= 2000) tieredDiscountPercentage = 5;
    const savings = tieredDiscountPercentage > 0 ? (subtotal * tieredDiscountPercentage) / 100 : 0;

    return NextResponse.json({ items, subtotal, savings }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cart details:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}