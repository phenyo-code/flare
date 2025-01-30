import { prisma } from "../lib/db/prisma";
import Link from "next/link";
import AdminHeader from "../components/AdminHeader";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
    <AdminHeader />
    <div className="max-w-4xl mt-10 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>
      <ul className="space-y-4">
        {products.map((product) => (
          <li key={product.id} className="p-4 border border-gray-200 rounded-md">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-600">R{product.price}</p>
            <Link
              href={`/admin/update-product/${product.id}`}
              className="block mt-2 bg-gray-500 text-white text-center p-2 rounded-md hover:bg-gray-600"
            >
              Edit Product
            </Link>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
}
