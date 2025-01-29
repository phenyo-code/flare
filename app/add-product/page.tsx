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
  const category = formData.get("category")?.toString();
  const filter = formData.get("filter")?.toString();
  const image = formData.get("image")?.toString();

  if (!name || !price || !category || !filter || !image) {
    throw new Error("Please fill in all fields.");
  }

  // Create a new product in the database
  await prisma.product.create({
    data: { name, price, category, filter, image },
  });

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

        <input
          name="image"
          placeholder="Image URL"
          className="w-full p-2 mb-2 border border-gray-300 rounded-md"
          required
        />

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
