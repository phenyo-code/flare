import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const { filters } = await req.json();
    console.log("API received filters:", filters);
    if (!Array.isArray(filters) || filters.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const products = await prisma.product.findMany({
      where: { filter: { in: filters } },
      include: { sizes: true },
    });
    console.log("API returning products:", products);
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}