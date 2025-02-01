import { prisma } from "../../../lib/db/prisma";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Edit Product | FLARE",
};

export async function updateProduct(formData: FormData) {
    "use server";

    const id = formData.get("id")?.toString();
    const name = formData.get("name")?.toString();
    const price = Number(formData.get("price") || 0);
    const originalPrice = Number(formData.get("originalPrice")) || price; // Default to price if not provided
    const category = formData.get("category")?.toString();
    const filter = formData.get("filter")?.toString();
    
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
        throw new Error("Please fill in all fields.");
    }

    // Update product
    await prisma.product.update({
        where: { id },
        data: { name, price, Originalprice: originalPrice, category, filter, images },
    });

    // Update sizes
    await prisma.size.deleteMany({ where: { productId: id } }); // Clear existing sizes
    
    const sizes = sizesData.map((sizeData: any) => {
        const [size, quantity, sold] = sizeData.toString().split(":"); // Expect format 'Size:Quantity:Sold'
        return {
            size,
            quantity: Number(quantity),
            sold: Number(sold),
            productId: id,
        };
    });

    await prisma.size.createMany({ data: sizes });

    redirect(`/admin/update-product/${id}?success=true`);
}

export default async function EditProductPage({
    params,
    searchParams,
}: {
    params: { id: string };
    searchParams: { success?: string };
}) {
    const product = await prisma.product.findUnique({
        where: { id: params.id },
        include: { sizes: true },
    });

    if (!product) {
        return redirect("/products"); // Redirect if product not found
    }

    const success = searchParams?.success === "true";

    return (
        <div>
            <div className="max-w-lg mt-10 mx-auto p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

                {success && (
                    <p className="mb-4 p-2 text-center text-white bg-green-500 rounded-md">
                        ✅ Product updated successfully!
                    </p>
                )}

                <form action={updateProduct}>
                    <input type="hidden" name="id" value={product.id} />

                    <label className="block font-semibold">Name</label>
                    <input name="name" defaultValue={product.name} className="w-full p-2 mb-2 border border-gray-300 rounded-md" required />

                    <label className="block font-semibold">Price</label>
                    <input name="price" type="number" defaultValue={product.price} className="w-full p-2 mb-2 border border-gray-300 rounded-md" required />
                    
                    <label className="block font-semibold">Original Price</label>
                    <input name="originalPrice" type="number" defaultValue={product.Originalprice} className="w-full p-2 mb-2 border border-gray-300 rounded-md" required />

                    <label className="block font-semibold">Category</label>
                    <input name="category" defaultValue={product.category} className="w-full p-2 mb-2 border border-gray-300 rounded-md" required />

                    <label className="block font-semibold">Filter</label>
                    <input name="filter" defaultValue={product.filter} className="w-full p-2 mb-2 border border-gray-300 rounded-md" required />

                    <label className="block font-semibold">Images</label>
                    {product.images.map((image, index) => (
                        <input key={index} name={`image${index + 1}`} defaultValue={image} className="w-full p-2 mb-2 border border-gray-300 rounded-md" />
                    ))}

                    <label className="block font-semibold">Sizes</label>
                    {product.sizes.map((size, index) => (
                        <input key={index} name="sizes" defaultValue={`${size.size}:${size.quantity}:${size.sold}`} placeholder="Size:Quantity:Sold (e.g., M:20:5)" className="w-full p-2 mb-2 border border-gray-300 rounded-md" />
                    ))}

                    <button type="submit" className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md">Update Product</button>
                </form>
            </div>
        </div>
    );
}
