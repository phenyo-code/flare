// app/api/recently-viewed/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  const { ids } = await req.json();

  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json([]);
  }

  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    include: {
      sizes: {
        select: { id: true, size: true, quantity: true, measurement: true },
      },
    },
  });

  // Preserve order from localStorage
  const orderedProducts = ids
    .map((id: string) => products.find((p) => p.id === id))
    .filter(Boolean);

  return NextResponse.json(orderedProducts);
}