import { prisma } from "../lib/db/prisma";
import Header from "../components/Header";
import CategoryHeader from "../components/CategoryHeader";
import Footer from "../components/Footer";
import FreeDeliveryBanner from "@/components/FreeDelivery";
import ForYouHero from "@/components/ForYouHero";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import ForYouTypes from "../components/ForYouTypes";

const PersonalizedProductList = dynamic(() => import("../components/PersonalizedProductList"));
const InteractionMessage = dynamic(() => import("../components/InteractionMessage"));

export const metadata = {
  title: "For You | FLARE",
};

export default async function ForYouPage() {
  // Fetch products (no select, full fields like CategoryPage, keep limit for performance)
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Extract unique filters (filter out null/undefined and use Set for uniqueness)
  const filters = Array.from(new Set(products.map(p => p.filter).filter(f => f)));

  // Featured product selection
  const featuredProductName = "Streetwear Vintage Multicolor Jacket";
  const selectedFeaturedProduct = products.find(p => p.name === featuredProductName) || products[0];

  return (
    <div>
      <FreeDeliveryBanner />
      <Header />
      <CategoryHeader activeCategory="FOR YOU" />
      <Suspense fallback={<p>Loading personalized products...</p>}>
        {products.length > 0 ? (
          <ForYouTypes initialProducts={products} filters={filters} featuredProduct={selectedFeaturedProduct} />
        ) : (
          <InteractionMessage />
        )}
      </Suspense>
      <Footer />
    </div>
  );
}