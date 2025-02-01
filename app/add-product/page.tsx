import { redirect } from "next/navigation";
import { prisma } from "../lib/db/prisma";
import AdminHeader from "../components/AdminHeader";

export const metadata = {
  title: "Add Product | FLARE",
};

export async function AddProduct(formData: FormData) {
  "use server";

  const name = formData.get("name")?.toString();
  const price = Number(formData.get("price") || 0);
  const originalPrice = Number(formData.get("originalPrice") || price); // Use provided original price, or default to price
  const category = formData.get("category")?.toString();
  const filter = formData.get("filter")?.toString();
  const images = [
    formData.get("image1")?.toString(),
    formData.get("image2")?.toString(),
    formData.get("image3")?.toString(),
    formData.get("image4")?.toString(),
    formData.get("image5")?.toString(),
  ].filter(Boolean); // Only include non-empty values

  const sizesData = formData.getAll("sizes"); // Get all sizes data

  if (!name || !price || !category || !filter || !images.length || !sizesData.length) {
    throw new Error("Please fill in all fields.");
  }

  // Create the new product with 'Originalprice' included
  const product = await prisma.product.create({
    data: { 
      name, 
      price, 
      Originalprice: originalPrice,  // Store original price
      category, 
      filter, 
      images 
    },
  });

  // Parse the sizes and handle invalid data
  const sizes = sizesData.map((sizeData: any) => {
    const [size, sold, quantity] = sizeData.toString().split(":");

    // Validate size, sold, and quantity
    if (!size || isNaN(Number(sold)) || isNaN(Number(quantity))) {
      return null; // Skip invalid size data
    }

    return {
      size,
      sold: Number(sold),
      quantity: Number(quantity),
      productId: product.id,
    };
  }).filter(Boolean); // Remove invalid size data

  // Only create sizes if we have valid data
  if (sizes.length > 0) {
    await prisma.size.createMany({
      data: sizes,
    });
  }

  // Redirect with a success message
  redirect("/add-product?success=true");
}

export default function AddProductPage({ searchParams }: { searchParams: { success?: string } }) {
  const success = searchParams?.success === "true";

  return (
    <div>
      <AdminHeader />
      <div className="max-w-lg mt-10 mx-auto p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Add Product</h2>

        {/* Show success message if redirected with ?success=true */}
        {success && (
          <p className="mb-4 p-2 text-center text-white bg-green-500 rounded-md">
            ✅ Product created successfully!
          </p>
        )}

        <form action={AddProduct}>
          <input
            name="name"
            placeholder="Product Name"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
            required
          />

          <input
            name="price"
            placeholder="Price"
            type="number"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
            required
          />

          <input
            name="originalPrice"
            placeholder="Original Price"
            type="number"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
          />

          <input
            name="category"
            placeholder="Category"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
            required
          />

          <input
            name="filter"
            placeholder="Filter"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
            required
          />

          {/* Image URLs input fields */}
          <input
            name="image1"
            placeholder="Image URL 1"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
            required
          />
          <input
            name="image2"
            placeholder="Image URL 2"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
          />
          <input
            name="image3"
            placeholder="Image URL 3"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
          />
          <input
            name="image4"
            placeholder="Image URL 4"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
          />
          <input
            name="image5"
            placeholder="Image URL 5"
            className="w-full p-2 mb-2 border border-gray-300 rounded-md"
          />

          {/* Dynamic Sizes Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Sizes (e.g., "Small:10:50" where 10 is sold, 50 is quantity)
            </label>

            {/* Add multiple size inputs */}
            <div className="space-y-2">
              <input
                name="sizes"
                placeholder="Size:Sold:Quantity (e.g., S:10:50)"
                className="w-2/3 p-2 border border-gray-300 rounded-md"
                required
              />
              <input
                name="sizes"
                placeholder="Size:Sold:Quantity (e.g., M:15:30)"
                className="w-2/3 p-2 border border-gray-300 rounded-md"
              />
              <input
                name="sizes"
                placeholder="Size:Sold:Quantity (e.g., L:20:40)"
                className="w-2/3 p-2 border border-gray-300 rounded-md"
              />
              <input
                name="sizes"
                placeholder="Size:Sold:Quantity (e.g., XL:5:25)"
                className="w-2/3 p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 w-full bg-green-500 text-white p-2 rounded-md"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
