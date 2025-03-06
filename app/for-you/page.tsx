import { prisma } from "../lib/db/prisma";
import Header from "../components/Header";
import CategoryHeader from "../components/CategoryHeader";
import FreeDeliveryBanner from "@/components/FreeDelivery";
import ForYouHero from "@/components/ForYouHero";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import ForYouTypes from "../components/ForYouTypes";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/options";
import StandaloneHeader from "@/components/StandaloneHeader";

const PersonalizedProductList = dynamic(() => import("../components/PersonalizedProductList"));
const InteractionMessage = dynamic(() => import("../components/InteractionMessage"));

export const metadata = {
  title: "For You | FLARE",
};

export default async function ForYouPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { sizes: true, reviews: true },
  });

  const session = await getServerSession(authOptions);
  const cart = session
    ? await prisma.cart.findFirst({
        where: { userId: session.user.id },
        select: { id: true },
      })
    : null;

  // Default fallback product
  const defaultFeaturedProduct = products[0] || null;

  const filters = Array.from(new Set(products.map((p) => p.filter).filter((f) => f)));

  return (
    <div>
      <FreeDeliveryBanner />
      <StandaloneHeader />
      <Header />
      <CategoryHeader activeCategory="FOR YOU" />
      <Suspense fallback={<p>Loading personalized content...</p>}>
        {products.length > 0 ? (
          <ForYouTypes
            initialProducts={products}
            filters={filters}
            featuredProduct={defaultFeaturedProduct}
            allProducts={products} // Pass all products for ForYouHero
            cartId={cart?.id}
          />
        ) : (
          <InteractionMessage />
        )}
      </Suspense>
    </div>
  );
}