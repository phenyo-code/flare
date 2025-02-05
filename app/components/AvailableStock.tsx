import { prisma } from "@/lib/db/prisma";

export default async function AvailableStock({ productId }: { productId: string }) {
  const sizes = await prisma.size.findMany({
    where: { productId },
    select: { quantity: true },
  });

  const availableStock = sizes.reduce((total, size) => total + size.quantity, 0);

  return <span>Available Stock: {availableStock}</span>;
}
