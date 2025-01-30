"use server";

import { prisma } from "../lib/db/prisma";

export async function updateProduct(formData: FormData) {
    const id = formData.get("id")?.toString(); // Get the product ID
    const name = formData.get("name")?.toString();
    const price = Number(formData.get("price") || 0);
    const category = formData.get("category")?.toString();
    const filter = formData.get("filter")?.toString();
    const image = formData.get("image")?.toString();

    if (!id) {
        throw new Error("Product ID is required");
    }

    await prisma.product.update({
        where: { id },
        data: {
            name,
            price,
            category,
            filter,
            image,
        },
    });
}
