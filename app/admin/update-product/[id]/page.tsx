import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { updateProduct } from "@/actions/updateProduct";

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

// Generate metadata dynamically
export async function generateMetadata({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    select: { name: true },
  });

  return {
    title: product ? `Edit ${product.name}` : "Product Not Found",
    description: product ? `Modify details of ${product.name}.` : "This product does not exist.",
  };
}

// Edit Product Page
export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    redirect("/"); // Redirect if not admin
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { sizes: true },
  });

  if (!product) {
    notFound(); // If product not found
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

      {/* Form to Update Product */}
      <form action={updateProduct}>
        <input type="hidden" name="id" value={product.id} />

        {/* Product Image */}
        <div className="flex justify-center mb-4">
          <Image src={product.images[0]} alt={product.name} width={150} height={150} className="object-cover rounded-lg" />
        </div>

        {/* Product Name */}
        <label className="block font-semibold">Name</label>
        <input name="name" defaultValue={product.name} className="w-full p-2 mb-2 border border-gray-300 rounded-md" required />

        {/* Price */}
        <label className="block font-semibold">Price</label>
        <input name="price" type="number" defaultValue={product.price} className="w-full p-2 mb-2 border border-gray-300 rounded-md" required />

        {/* Original Price */}
        <label className="block font-semibold">Original Price</label>
        <input name="originalPrice" type="number" defaultValue={product.Originalprice} className="w-full p-2 mb-2 border border-gray-300 rounded-md" required />

        {/* Category */}
        <label className="block font-semibold">Category</label>
        <input name="category" defaultValue={product.category} className="w-full p-2 mb-2 border border-gray-300 rounded-md" required />

        {/* Filter */}
        <label className="block font-semibold">Filter</label>
        <input name="filter" defaultValue={product.filter} className="w-full p-2 mb-2 border border-gray-300 rounded-md" required />

        {/* Images */}
        <label className="block font-semibold">Images</label>
        {product.images.map((image, index) => (
          <input key={index} name={`image${index + 1}`} defaultValue={image} className="w-full p-2 mb-2 border border-gray-300 rounded-md" />
        ))}

        {/* Sizes */}
        <label className="block font-semibold">Sizes</label>
        {product.sizes.map((size, index) => (
          <input key={index} name="sizes" defaultValue={`${size.size}:${size.quantity}:${size.sold}`} placeholder="Size:Quantity:Sold (e.g., M:20:5)" className="w-full p-2 mb-2 border border-gray-300 rounded-md" />
        ))}

        {/* Submit Button */}
        <button type="submit" className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md">Update Product</button>
      </form>

      {/* Back to Products */}
      <div className="text-center mt-4">
        <Link href="/products">
          <button className="text-blue-500">Back to Products</button>
        </Link>
      </div>
    </div>
  );
}
