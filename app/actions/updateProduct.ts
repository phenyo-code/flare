"use server";

import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";

export async function updateProduct(formData: FormData): Promise<void> {
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString();
  const price = Number(formData.get("price") || 0);
  const originalPrice = Number(formData.get("originalPrice")) || price;
  const category = formData.get("category")?.toString();
  const filter = formData.get("filter")?.toString();
  const style = formData.get("style")?.toString();
  const type = formData.get("type")?.toString();
  const matchesWithString = formData.get("matchesWith")?.toString();
  const matchesWith = matchesWithString ? matchesWithString.split(",").map(item => item.trim()) : [];
  const images = [
    formData.get("image1")?.toString(),
    formData.get("image2")?.toString(),
    formData.get("image3")?.toString(),
    formData.get("image4")?.toString(),
    formData.get("image5")?.toString(),
  ].filter(Boolean);

  if (!id || !name || !price || !category || !filter || !images.length) {
    console.error("Please fill in all required fields.");
    return;
  }

  await prisma.product.update({
    where: { id },
    data: { 
      name, 
      price, 
      Originalprice: originalPrice, 
      category, 
      filter, 
      images,
      style,
      type,
      matchesWith,
    },
  });

  console.log("Product updated successfully!");
  redirect("/admin"); // Redirect after update
}

// 🔥 Delete Product Action
export async function deleteProduct(formData: FormData): Promise<void> {
  const id = formData.get("id")?.toString();

  console.log("Attempting to delete size with ID:", id);

  if (!id) {
    console.error("Size ID is required for deletion.");
    throw new Error("Size ID is required");
  }

  try {
    // Check for related records
    const relatedItems = await prisma.orderItem.count({
      where: {
        sizeId: id,
      },
    });

    if (relatedItems > 0) {
      throw new Error("Cannot delete size because it is referenced by existing order items");
    }

    const deletedSize = await prisma.size.delete({
      where: { id },
    });

    console.log(`Size ${deletedSize.id} deleted successfully!`);
  } catch (error) {
    console.error("Failed to delete size:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to delete size: ${error.message}`);
    }
    throw new Error("An unexpected error occurred during deletion");
  }

  redirect("/admin");
}