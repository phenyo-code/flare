import { prisma } from "@/lib/db/prisma";
import AdminHeader from "@/components/AdminHeader";
import FilterBar from "./FilterBar";
import { Suspense } from "react";
import StatusFilterWrapper from "./StatusFilterWrapper";

export const metadata = {
  title: "Manage Orders | Admin Panel",
};

export default async function ManageOrdersPage({ searchParams }) {
  const sortOrder = searchParams.sort === "asc" ? "asc" : "desc";
  const success = searchParams.success === "true";

  console.log("ManageOrdersPage - sortOrder:", sortOrder);
  console.log("ManageOrdersPage - success:", success);

  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: sortOrder,
    },
    include: {
      items: {
        include: {
          product: true,
          size: true,
        },
      },
      user: true,
    },
  });

  const distinctStatuses = await prisma.order.groupBy({
    by: ["status"],
  });
  const statuses = distinctStatuses.map((s) => s.status.toLowerCase());

  console.log("ManageOrdersPage - fetched orders count:", orders.length);
  console.log("ManageOrdersPage - unique statuses from DB:", statuses);
  console.log("ManageOrdersPage - order statuses in DB:", orders.map((o) => ({
    id: o.id,
    status: o.status,
    normalizedStatus: o.status.toLowerCase(),
  })));

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Manage Orders</h2>

        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">
            Order status updated successfully!
          </div>
        )}

        <FilterBar initialSort={sortOrder} />
        <Suspense fallback={<p>Loading status filters...</p>}>
          <StatusFilterWrapper initialOrders={orders} statuses={statuses} />
        </Suspense>
      </div>
    </div>
  );
}