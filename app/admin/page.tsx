import { FaBox, FaUsers, FaShoppingCart, FaChartLine } from "react-icons/fa";
import { prisma } from "../lib/db/prisma";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard | FLARE",
};

export default async function AdminDashboard() {
  "use server";

  // Fetch data directly from the database using Prisma
  const totalProducts = await prisma.product.count();
  const totalUsers = await prisma.user.count();
  const totalGoogleUsers = await prisma.googleUser.count();
  const combinedUsers = totalUsers + totalGoogleUsers;

  const totalOrders = await prisma.order.count();
  const totalSales = await prisma.order.aggregate({
    _sum: {
      totalPrice: true,
    },
  });

  const totalOrderItems = await prisma.orderItem.count();

  return (
    <div className="max-w-6xl mt-10 mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-4 text-center text-black">Admin Dashboard</h2>
      <p className="mb-6 text-center text-black">Managing products, orders, and more.</p>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white text-black p-6 rounded-lg shadow-md flex items-center border gap-8 border-red-500">
          <FaBox className="text-3xl mr-4 text-red-500" />
          <div>
            <h3 className="text-xl font-semibold">Products</h3>
            <p className="text-2xl">{totalProducts}</p>
          </div>
        </div>
        <div className="bg-white text-black p-6 rounded-lg shadow-md flex items-center border border-red-500">
          <FaUsers className="text-3xl mr-4 text-red-500" />
          <div>
            <h3 className="text-xl font-semibold">Customers</h3>
            <p className="text-2xl">{combinedUsers}</p>
          </div>
        </div>
        <div className="bg-white text-black p-6 rounded-lg shadow-md flex items-center border border-red-500">
          <FaShoppingCart className="text-3xl mr-4 text-red-500" />
          <div>
            <h3 className="text-xl font-semibold">Orders</h3>
            <p className="text-2xl">{totalOrders}</p>
          </div>
        </div>
        <div className="bg-white text-black p-6 rounded-lg shadow-md flex items-center border border-red-500">
          <FaChartLine className="text-3xl mr-4 text-red-500" />
          <div>
            <h3 className="text-xl font-semibold">Total Sales</h3>
            <p className="text-2xl">R{totalSales._sum.totalPrice}</p>
          </div>
        </div>
      </div>

      {/* Links Section */}
      <div className="space-y-4 mb-8">
        <Link
          href="/add-product"
          className="block w-full bg-white text-black text-center p-3 rounded-md border border-red-500 hover:bg-red-500 hover:text-white"
        >
          Add New Product
        </Link>

        <Link
          href="/products"
          className="block w-full bg-white text-black text-center p-3 rounded-md border border-red-500 hover:bg-red-500 hover:text-white"
        >
          Manage Products
        </Link>

        <Link
          href="/orders-admin"
          className="block w-full bg-white text-black text-center p-3 rounded-md border border-red-500 hover:bg-red-500 hover:text-white"
        >
          Manage Orders
        </Link>
      </div>
    </div>
  );
}
