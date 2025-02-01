import { FaChartLine, FaBox, FaUsers, FaProductHunt } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard | FLARE",
};

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mt-10 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Admin Dashboard</h2>
      <p className="mb-6 text-center text-gray-700">Manage your products, orders, and more.</p>

      {/* Links Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <Link
            href="/admin/manage-products"
            className="flex items-center space-x-4"
          >
            <FaBox className="text-4xl" />
            <span className="text-xl">Manage Products</span>
          </Link>
        </div>
        <div className="bg-green-500 text-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <Link
            href="/admin/manage-orders"
            className="flex items-center space-x-4"
          >
            <FaChartLine className="text-4xl" />
            <span className="text-xl">Manage Orders</span>
          </Link>
        </div>
        <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <Link
            href="/add-product"
            className="flex items-center space-x-4"
          >
            <IoMdAddCircle className="text-4xl" />
            <span className="text-xl">Add New Product</span>
          </Link>
        </div>
        
      </div>
    </div>
  );
}
