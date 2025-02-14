import { prisma } from "@/lib/db/prisma";

export async function updateProduct(formData: FormData): Promise<void> {
    "use server";

    const id = formData.get("id")?.toString();
    const name = formData.get("name")?.toString();
    const price = Number(formData.get("price") || 0);
    const originalPrice = Number(formData.get("originalPrice")) || price; // Default to price if not provided
    const category = formData.get("category")?.toString();
    const filter = formData.get("filter")?.toString();
    const style = formData.get("style")?.toString();
    const type = formData.get("type")?.toString();
    
    // Get matchesWith as an array (comma-separated input)
    const matchesWithString = formData.get("matchesWith")?.toString();
    const matchesWith = matchesWithString ? matchesWithString.split(",").map(item => item.trim()) : [];

    // Get image URLs
    const images = [
        formData.get("image1")?.toString(),
        formData.get("image2")?.toString(),
        formData.get("image3")?.toString(),
        formData.get("image4")?.toString(),
        formData.get("image5")?.toString(),
    ].filter(Boolean);

    const sizesData = formData.getAll("sizes"); // Get all sizes data

    if (!id || !name || !price || !category || !filter || !images.length || !sizesData.length) {
        console.error("Please fill in all fields.");
        return;
    }

    // Update product
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
            matchesWith, // Update the matchesWith field as an array
        },
    });

    // Update sizes
    await prisma.size.deleteMany({ where: { productId: id } }); // Clear existing sizes
    
    const sizes = sizesData.map((sizeData: any) => {
        const [size, sold, quantity, measurement] = sizeData.toString().split(":"); // Expect format 'Size:Sold:Quantity:Measurement'
        return {
            size,
            sold: Number(sold),
            quantity: Number(quantity),
            measurement: measurement || "default_value", // Use default if not provided
            productId: id,
        };
    });

    await prisma.size.createMany({ data: sizes });

    console.log("Product updated successfully!");
}
