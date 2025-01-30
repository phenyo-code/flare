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
    const category = formData.get("category")?.toString();
    const filter = formData.get("filter")?.toString();
    const image = formData.get("image")?.toString();
  
    if (!id || !name || !price || !category || !filter || !image) {
      throw new Error("Please fill in all fields.");
    }
  
    // Update the product in the database
    await prisma.product.update({
      where: { id },
      data: { name, price, category, filter, image },
    });
  
    // Redirect with a success message
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
    });
  
    if (!product) {
      return redirect("/products"); // Redirect if product not found
    }
  
    const success = searchParams?.success === "true";
  
    return (
      <div>
        <div className="max-w-lg mt-10 mx-auto p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
  
          {/* Success message */}
          {success && (
            <p className="mb-4 p-2 text-center text-white bg-green-500 rounded-md">
              ✅ Product updated successfully!
            </p>
          )}
  
          <form action={updateProduct}>
            {/* Hidden input to store product ID */}
            <input type="hidden" name="id" value={product.id} />
  
            <label className="block font-semibold">Name</label>
            <input
              name="name"
              defaultValue={product.name}
              className="w-full p-2 mb-2 border border-gray-300 rounded-md"
              required
            />
  
            <label className="block font-semibold">Price</label>
            <input
              name="price"
              type="number"
              defaultValue={product.price}
              className="w-full p-2 mb-2 border border-gray-300 rounded-md"
              required
            />
  
            <label className="block font-semibold">Category</label>
            <input
              name="category"
              defaultValue={product.category}
              className="w-full p-2 mb-2 border border-gray-300 rounded-md"
              required
            />
  
            <label className="block font-semibold">Filter</label>
            <input
              name="filter"
              defaultValue={product.filter}
              className="w-full p-2 mb-2 border border-gray-300 rounded-md"
              required
            />
  
            <label className="block font-semibold">Image URL</label>
            <input
              name="image"
              defaultValue={product.image}
              className="w-full p-2 mb-2 border border-gray-300 rounded-md"
              required
            />
  
            <button
              type="submit"
              className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md"
            >
              Update Product
            </button>
          </form>
        </div>
      </div>
    );
  }