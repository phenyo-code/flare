"use server";

import { prisma } from "@/lib/db/prisma";

// Define the standard status values (lowercase to match FilterBar)
const standardStatuses = [
  "order submitted",
  "preparing",
  "packaged",
  "shipped",
  "delivered",
  "canceled",
];

// Mapping for specific cases
const statusOverrides: { [key: string]: string } = {
  pending: "order submitted",
  PENDING: "order submitted",
};

async function normalizeOrderStatuses() {
  try {
    // Fetch all distinct statuses currently in the database
    const distinctStatuses = await prisma.order.groupBy({
      by: ["status"],
    });
    const currentStatuses = distinctStatuses.map((s) => s.status);

    console.log("Current statuses in database:", currentStatuses);

    // Map current statuses to standard lowercase statuses or overrides
    const statusMap: { [key: string]: string } = {};
    currentStatuses.forEach((status) => {
      const normalizedStatus = status.toLowerCase().trim();
      // Check for explicit overrides first (e.g., "pending" or "PENDING")
      if (statusOverrides[status]) {
        statusMap[status] = statusOverrides[status];
      } else {
        // Otherwise, match against standard statuses
        const matchedStatus = standardStatuses.find((std) => std === normalizedStatus);
        if (matchedStatus) {
          statusMap[status] = matchedStatus;
        } else {
          // Log unmatched statuses for manual review
          console.warn(`Unmatched status found: "${status}" - will not be updated`);
        }
      }
    });

    console.log("Status mapping:", statusMap);

    // Update all orders to use the normalized status
    for (const [oldStatus, newStatus] of Object.entries(statusMap)) {
      if (oldStatus !== newStatus) {
        const updatedCount = await prisma.order.updateMany({
          where: { status: oldStatus },
          data: { status: newStatus },
        });
        console.log(`Updated ${updatedCount.count} orders from "${oldStatus}" to "${newStatus}"`);
      } else {
        console.log(`No update needed for "${oldStatus}" (already matches "${newStatus}")`);
      }
    }

    console.log("Order statuses normalization completed successfully!");
  } catch (error) {
    console.error("Error normalizing order statuses:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
normalizeOrderStatuses();