// app/api/products/[id]/route.ts
import { prisma } from "@/lib/db/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;  // Extract product ID from URL

  if (!id) {
    return new Response("Product ID is required", { status: 400 });
  }

  try {
    // Fetch the product by ID from the database
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return new Response("Product not found", { status: 404 });
    }

    // Return the product data as JSON
    return new Response(JSON.stringify(product), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
