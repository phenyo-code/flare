import { prisma } from "../lib/db/prisma";
import { redirect } from "next/navigation";

export async function deleteProduct(formData: FormData) {
  "use server";

  const id = formData.get("id")?.toString();

  if (!id) {
    throw new Error("Product ID is required.");
  }

  try {
    // Delete related records first to avoid violation of relational constraints
    // Delete related CartItems and OrderItems
    await prisma.cartItem.deleteMany({
      where: { productId: id },
    });

    await prisma.orderItem.deleteMany({
      where: { productId: id },
    });

    // Delete related sizes
    await prisma.size.deleteMany({
      where: { productId: id },
    });

    // Now delete the product
    await prisma.product.delete({
      where: { id },
    });

    // Redirect back to the product list after deletion
    redirect("/products");
  } catch (error) {
    console.error("Error deleting product:", error);
    throw new Error("An error occurred while deleting the product.");
  }
}
