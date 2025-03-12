// app/api/wishlist/route.ts
import { prisma } from "@/lib/db/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { ids } = await request.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: ids },
      },
      include: {
        sizes: {
          select: {
            id: true,
            size: true,
            quantity: true,
            measurement: true,
          },
        },
      },
    });

    // Preserve order from localStorage
    const orderedProducts = ids
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean);

    return NextResponse.json(orderedProducts, { status: 200 });
  } catch (error) {
    console.error("Error fetching wishlist products:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}