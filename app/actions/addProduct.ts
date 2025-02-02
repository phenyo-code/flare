"use server";

import { redirect } from "next/navigation";
import { prisma } from "../lib/db/prisma";

export async function AddProduct(formData: FormData) {
  const name = formData.get("name")?.toString();
  const price = Number(formData.get("price") || 0);
  const originalPrice = Number(formData.get("originalPrice") || price); // Default to price
  const category = formData.get("category")?.toString();
  const filter = formData.get("filter")?.toString();
  const images = [
    formData.get("image1")?.toString(),
    formData.get("image2")?.toString(),
    formData.get("image3")?.toString(),
    formData.get("image4")?.toString(),
    formData.get("image5")?.toString(),
  ].filter(Boolean); // Remove empty values

  const sizesData = formData.getAll("sizes"); // Get all sizes

  if (!name || !price || !category || !filter || images.length === 0 || sizesData.length === 0) {
    throw new Error("Please fill in all fields.");
  }

  // Create Product
  const product = await prisma.product.create({
    data: { 
      name, 
      price, 
      Originalprice: originalPrice,  // Corrected naming 
      category, 
      filter, 
      images 
    },
  });

  // Process Sizes
  const sizes = sizesData
    .map((sizeData: any) => {
      const parts = sizeData.toString().split(":");
      if (parts.length !== 3) return null; // Ensure correct format

      const [size, sold, quantity] = parts;
      return (!size || isNaN(Number(sold)) || isNaN(Number(quantity)))
        ? null
        : {
            size,
            sold: Number(sold),
            quantity: Number(quantity),
            productId: product.id,
          };
    })
    .filter(Boolean); // Remove invalid sizes

  // Insert Sizes
  if (sizes.length > 0) {
    await prisma.size.createMany({
      data: sizes,
    });
  }

  // Redirect on success
  redirect("/add-product?success=true");
}
