import { prisma } from "../lib/db/prisma";
import Header from "../components/Header";
import CategoryHeader from "../components/CategoryHeader";
import Footer from "../components/Footer";
import FreeDeliveryBanner from "@/components/FreeDelivery";
import ForYouHero from "@/components/ForYouHero";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamically import components (but no `ssr: false`)
const PersonalizedProductList = dynamic(() => import("../components/PersonalizedProductList"));
const InteractionMessage = dynamic(() => import("../components/InteractionMessage"));

export const metadata = {
  title: "For You | FLARE",
};

export default async function ForYouPage() {
  // Fetch products (limit to 20 for better performance)
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      Originalprice: true,
      category: true,
      filter: true,
      images: true,
      isRecommended: true,
      createdAt: true,
      updatedAt: true,
      style: true,
      type: true,
      matchesWith: true,
    },
    orderBy: { createdAt: "desc" },
    take: 20, // Fetch only 20 products for performance
  });

  // Featured product selection
  const featuredProductName = "Streetwear Vintage Multicolor Jacket";
  const selectedFeaturedProduct = products.find(p => p.name === featuredProductName) || products[0];

  return (
    <div>
      <FreeDeliveryBanner />
      <Header />
      <CategoryHeader activeCategory="FOR YOU" />

      <ForYouHero product={selectedFeaturedProduct} />

      {/* Wrap dynamic components inside Suspense */}
      <Suspense fallback={<p>Loading personalized products...</p>}>
        {products.length > 0 ? (
          <PersonalizedProductList allProducts={products} />
        ) : (
          <InteractionMessage />
        )}
      </Suspense>

      <Footer />
    </div>
  );
}
