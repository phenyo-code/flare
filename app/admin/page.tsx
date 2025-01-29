import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard | FLARE",
};

export default function AdminDashboard() {
  return (
    <div className="max-w-4xl mt-10 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <p className="mb-6 text-gray-700">Manage your products and categories.</p>

      <div className="space-y-4">
        <Link
          href="/add-product"
          className="block w-full bg-blue-500 text-white text-center p-3 rounded-md hover:bg-blue-600"
        >
          ➕ Add Product
        </Link>

        <Link
          href="/admin/products"
          className="block w-full bg-gray-500 text-white text-center p-3 rounded-md hover:bg-gray-600"
        >
          📦 Manage Products
        </Link>
      </div>
    </div>
  );
}
