// app/category/[category]/page.tsx
import { prisma } from "../../lib/db/prisma";
import CategoryHeader from "../../components/CategoryHeader";
import HeroSection from "../../components/HeroSection";
import Header from "../../components/Header";
import dynamic from "next/dynamic";
import FreeDeliveryBanner from "@/components/FreeDelivery";
import { Suspense } from "react";
import { Metadata } from "next";
import CategoryTypes from "../../components/CategoryTypes";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/options";
import StandaloneHeader from "@/components/StandaloneHeader";
import { storeCategoryView } from "@/utils/cookies";

const ProductList = dynamic(() => import("../../components/ProductList"));

interface CategoryPageParams {
  category: string;
}

export async function generateMetadata({ params }: { params: Promise<CategoryPageParams> }) {
  const { category } = await params;
  const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  return {
    title: `${capitalizedCategory} Products | FLARE`,
    description: `Browse the latest ${capitalizedCategory} fashion at FLARE. Shop trendy ${capitalizedCategory} streetwear and apparel with free delivery on orders over R1000.`,
    keywords: `${capitalizedCategory}, fashion, streetwear, apparel, FLARE shop, free delivery`,
  };
}

// Server-side component
async function CategoryPageServer({ category }: CategoryPageParams) {
  const products = await prisma.product.findMany({
    where: { category: category.toUpperCase() },
    orderBy: { createdAt: "desc" },
    include: { sizes: true, reviews: true },
  });

  const filters = Array.from(new Set(products.map((p) => p.filter).filter((f) => f)));

  const session = await getServerSession(authOptions);
  const cart = session
    ? await prisma.cart.findFirst({
        where: { userId: session.user.id },
        select: { id: true },
      })
    : null;

  const processedProducts = products.map((product) => ({
    ...product,
    Originalprice: product.Originalprice ?? 0,
  }));

  // JSON-LD for Category Page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category} Products - FLARE`,
    "description": `Browse the latest ${category} fashion at FLARE. Shop trendy ${category} streetwear and apparel with free delivery on orders over R1000.`,
    "url": `https://flare-shop.vercel.app/category/${category.toLowerCase()}`,
    "publisher": {
      "@type": "Organization",
      "name": "FLARE",
      "logo": {
        "@type": "ImageObject",
        "url": "https://flare-shop.vercel.app/logo.png",
      },
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://flare-shop.vercel.app/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": category.charAt(0).toUpperCase() + category.slice(1).toLowerCase(),
          "item": `https://flare-shop.vercel.app/category/${category.toLowerCase()}`,
        },
      ],
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": `${category} Fashion Products`,
      "itemListElement": processedProducts.slice(0, 10).map((product, index) => ({
        "@type": "Product",
        "position": index + 1,
        "name": product.name,
        "url": `https://flare-shop.vercel.app/product/${product.id}`,
        "image": product.images.length > 0 ? product.images[0] : "/default-product-image.png",
        "description": `Stylish ${product.category} ${product.filter} from FLARE - ${product.style || "trendy fashion"}`,
        "sku": product.id,
        "offers": {
          "@type": "Offer",
          "price": product.price.toString(),
          "priceCurrency": "ZAR",
          "availability": product.sizes.some((size) => size.quantity > 0)
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        "aggregateRating": product.reviews.length > 0
          ? {
              "@type": "AggregateRating",
              "ratingValue": (
                product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
              ).toFixed(1),
              "reviewCount": product.reviews.length.toString(),
            }
          : undefined,
      })),
    },
  };

  return (
    <div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      <FreeDeliveryBanner />
      <StandaloneHeader />
      <Header />
      <CategoryHeader activeCategory={category} />
      <HeroSection product={products[0]} />
      <Suspense fallback={<p>Loading products...</p>}>
        <CategoryTypes
          initialProducts={processedProducts}
          filters={filters}
          category={category}
          cartId={cart?.id}
        />
      </Suspense>
    </div>
  );
}

// Client-side wrapper to track category views
export default async function CategoryPage({ params }: { params: Promise<CategoryPageParams> }) {
  const { category } = await params;

  // Client-side effect to store category view
  if (typeof window !== "undefined") {
    storeCategoryView(category);
  }

  return <CategoryPageServer category={category} />;
}