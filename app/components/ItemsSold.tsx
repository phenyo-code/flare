"use server"; // Ensures this runs on the server

import { prisma } from "@/lib/db/prisma";

type SoldCountProps = {
  productId?: string; // Make productId optional
};

export default async function SoldCount(props: SoldCountProps) {
  const { productId } = props || {}; // Ensure destructuring doesn't fail

  if (!productId) {
    return <p className="text-xs text-gray-500">Sold count unavailable</p>;
  }

  const sizes = await prisma.size.findMany({
    where: { productId },
    select: { sold: true },
  });

  const soldCount = sizes.reduce((total, size) => total + size.sold, 0);

  return <p className="text-xs text-gray-500">{soldCount}+ sold</p>;
}
