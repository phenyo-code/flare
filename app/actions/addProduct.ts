"use server";

import { redirect } from "next/navigation";
import { prisma } from "../lib/db/prisma";

export async function AddProduct(formData: FormData) {
  // Extracting basic product fields
  const name = formData.get("name")?.toString();
  const price = Number(formData.get("price") || 0);
  const originalPrice = Number(formData.get("originalPrice") || price);
  const category = formData.get("category")?.toString();
  const filter = formData.get("filter")?.toString();
  const style = formData.get("style")?.toString(); // Used as brandName
  const type = formData.get("type")?.toString();
  const logo = formData.get("logo")?.toString(); // New logo field
  const matchesWithRaw = formData.get("matchesWith")?.toString();
  const matchesWith = matchesWithRaw ? matchesWithRaw.split(",").map((item) => item.trim()) : [];

  // Collecting images, filtering out empty values
  const images = [
    formData.get("image1")?.toString(),
    formData.get("image2")?.toString(),
    formData.get("image3")?.toString(),
    formData.get("image4")?.toString(),
    formData.get("image5")?.toString(),
  ].filter(Boolean) as string[];

  // Collecting sizes
  const sizesData = formData.getAll("sizes").map(String); // Ensure it's an array of strings

  // Validate required fields
  if (!name || !price || !category || !filter || images.length === 0 || sizesData.length === 0) {
    throw new Error("Please fill in all required fields.");
  }

  // Create the product with logo
  const product = await prisma.product.create({
    data: {
      name,
      price,
      Originalprice: originalPrice,
      category,
      filter,
      style, // Used as brandName
      type,
      logo, // Include logo in product creation
      matchesWith,
      images,
    },
  });

  // Process Sizes
  const sizes = sizesData
    .map((sizeData) => {
      const parts = sizeData.split(":"); // Expecting format "Size:Sold:Quantity:Measurement"
      if (parts.length !== 4) return null;

      const [size, sold, quantity, measurement] = parts.map((part) => part.trim());

      if (!size || isNaN(Number(sold)) || isNaN(Number(quantity)) || !measurement) {
        return null;
      }

      return {
        size,
        measurement,
        sold: Number(sold),
        quantity: Number(quantity),
        productId: product.id,
      };
    })
    .filter(Boolean);

  // Insert Sizes
  if (sizes.length > 0) {
    await prisma.size.createMany({
      data: sizes,
    });
  }

  // Redirect on success
  redirect("/add-product?success=true");
}