// app/AdminDashboard/page.tsx
import { FaBox, FaUsers, FaShoppingCart, FaChartLine, FaGift, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { prisma } from "../lib/db/prisma";
import Link from "next/link";
import CustomChart from "./CustomChart";

export const metadata = {
  title: "Admin Dashboard | FLARE",
};

export default async function AdminDashboard() {
  const totalProducts = await prisma.product.count();
  const totalUsers = await prisma.user.count();
  const totalGoogleUsers = await prisma.googleUser.count();
  const combinedUsers = totalUsers + totalGoogleUsers;
  const totalOrders = await prisma.order.count();
  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  });

  const chartData = [
    { name: "Products", value: totalProducts },
    { name: "Customers", value: combinedUsers },
    { name: "Orders", value: totalOrders },
    { name: "Sales (R)", value: totalSales._sum.totalPrice || 0 },
  ];

  const topProducts = await prisma.size.groupBy({
    by: ["productId"],
    _sum: { sold: true },
    orderBy: { _sum: { sold: "desc" } },
    take: 5,
  });

  const topProductDetails = await Promise.all(
    topProducts.map(async (product) => {
      const prod = await prisma.product.findUnique({
        where: { id: product.productId },
        select: { name: true, category: true, images: true },
      });
      return {
        productId: product.productId,
        name: prod?.name || "Unknown",
        category: prod?.category || "N/A",
        totalSold: product._sum.sold || 0,
        image: prod?.images[0] || "",
      };
    })
  );

  const oldProducts = await prisma.product.findMany({
    orderBy: { createdAt: "asc" },
    take: 5,
    select: {
      id: true,
      name: true,
      category: true,
      createdAt: true,
      sizes: { select: { sold: true } },
      images: true,
    },
  });

  const oldProductDetails = oldProducts.map((product) => ({
    productId: product.id,
    name: product.name,
    category: product.category,
    createdAt: product.createdAt,
    totalSold: product.sizes.reduce((sum, size) => sum + (size.sold || 0), 0),
    image: product.images[0] || "",
  }));

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      totalPrice: true,
      status: true,
      createdAt: true,
    },
  });

  const topCustomers = await prisma.order.groupBy({
    by: ["userId"],
    _sum: { totalPrice: true },
    _count: { id: true },
    orderBy: { _sum: { totalPrice: "desc" } },
    take: 5,
  });

  const topCustomerDetails = await Promise.all(
    topCustomers.map(async (customer) => {
      const user = await prisma.user.findUnique({
        where: { id: customer.userId },
        select: { name: true, email: true },
      });
      return {
        userId: customer.userId,
        name: user?.name || "Unknown",
        email: user?.email || "N/A",
        totalSpent: customer._sum.totalPrice || 0,
        orderCount: customer._count.id,
      };
    })
  );

  const salesByCategory = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: { price: true },
    _count: { quantity: true },
  });

  const categorySales = await Promise.all(
    salesByCategory.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { category: true },
      });
      return {
        category: product?.category || "Uncategorized",
        totalSales: item._sum.price * item._count.quantity,
      };
    })
  );

  const aggregatedSalesByCategory = categorySales.reduce((acc: { [key: string]: number }, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.totalSales;
    return acc;
  }, {});

  const salesByCategoryDetails = Object.entries(aggregatedSalesByCategory).map(([category, totalSales]) => ({
    category,
    totalSales,
  }));

  const orderStats = await prisma.order.aggregate({
    _avg: { totalPrice: true },
    _count: { id: true },
  });
  const totalItemsSold = await prisma.orderItem.aggregate({
    _sum: { quantity: true },
  });

  const keyMetrics = {
    averageOrderValue: orderStats._avg.totalPrice || 0,
    totalOrders: orderStats._count.id,
    totalItemsSold: totalItemsSold._sum.quantity || 0,
  };

  const newsletterSubscribersStats = await prisma.order.groupBy({
    by: ["userId"],
    _sum: { totalPrice: true },
    _count: { id: true },
    where: {
      user: {
        newsletterSubscriptions: { some: {} },
      },
    },
    orderBy: { _sum: { totalPrice: "desc" } },
    take: 5,
  });

  const newsletterSubscribersDetails = await Promise.all(
    newsletterSubscribersStats.map(async (subscriber) => {
      const user = await prisma.user.findUnique({
        where: { id: subscriber.userId },
        select: {
          name: true,
          email: true,
          newsletterSubscriptions: {
            select: { id: true }, // Include a minimal field to confirm subscription
          },
        },
      });
      return {
        userId: subscriber.userId,
        name: user?.name || "Unknown",
        email: user?.email || "N/A",
        totalSpent: subscriber._sum.totalPrice || 0,
        orderCount: subscriber._count.id,
      };
    })
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">Admin Dashboard</h2>
          <p className="text-sm text-gray-500 text-center">Manage your store’s products, orders, and insights.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: FaBox, title: "Products", value: totalProducts },
            { icon: FaUsers, title: "Customers", value: combinedUsers },
            { icon: FaShoppingCart, title: "Orders", value: totalOrders },
            {
              icon: FaChartLine,
              title: "Total Sales",
              value: `R${totalSales._sum.totalPrice ? totalSales._sum.totalPrice.toFixed(2) : "0.00"}`,
            },
          ].map((metric, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-md shadow-sm border border-gray-200 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <metric.icon className="text-2xl text-red-500" />
              <div>
                <h3 className="text-sm font-medium text-gray-700">{metric.title}</h3>
                <p className="text-lg font-semibold text-gray-900">{metric.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chart and Stats */}
        <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Stats Overview</h3>
          <CustomChart
            data={chartData}
            topCustomers={topCustomerDetails}
            topProducts={topProductDetails}
            oldProducts={oldProductDetails}
            recentOrders={recentOrders}
            salesByCategory={salesByCategoryDetails}
            keyMetrics={keyMetrics}
            newsletterSubscribers={newsletterSubscribersDetails}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: "/add-product", label: "Add New Product" },
            { href: "/products", label: "Manage Products" },
            { href: "/orders-admin", label: "Manage Orders" },
            { href: "/coupons-admin", label: "Manage Coupons" },
          ].map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="bg-white text-gray-800 text-center p-3 rounded-md border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all duration-200"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}