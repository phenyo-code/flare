import { NextResponse } from "next/server";
import { prisma } from "../../lib/db/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json([]);
  }

  const products = await prisma.product.findMany({
    where: {
      name: { contains: query, mode: "insensitive" },
    },
    include: { sizes: true },
  });

  return NextResponse.json(products);
}