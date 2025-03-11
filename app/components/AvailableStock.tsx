import { prisma } from "@/lib/db/prisma";

export default async function AvailableStock({ sizeId }: { sizeId: string }) {
  const size = await prisma.size.findUnique({
    where: { id: sizeId },
    select: { quantity: true },
  });

  return <span className=" text-gray-500 text-xs">{size?.quantity ?? 0} Left</span>;
}
