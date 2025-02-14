import { prisma } from "@/lib/db/prisma";
import Horizontal from "./Horizontal";

interface MatchingProductsProps {
  productId: string; // The current product ID
}

export default async function MatchingProducts({ productId }: MatchingProductsProps) {
  // Fetch the current product's `matchesWith` array
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { matchesWith: true }, // Only fetch the `matchesWith` array
  });

  // If no product or matchesWith is empty, return nothing
  if (!product || !product.matchesWith || product.matchesWith.length === 0) {
    return null;
  }

  // Fetch products where `filter` is in the `matchesWith` array
  const matchingProducts = await prisma.product.findMany({
    where: {
      filter: { in: product.matchesWith }, // Match filter with any in matchesWith
    },
  });

  return <Horizontal products={matchingProducts} />;
}
