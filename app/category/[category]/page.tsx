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
  return {
    title: `Products in ${category}`,
    description: `Browse products in the ${category} category.`,
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

  return (
    <div>
      <FreeDeliveryBanner />
      <StandaloneHeader />
      <Header />
      <CategoryHeader activeCategory={category} />
      <HeroSection product={products[0]} />
      <Suspense fallback={<p>Loading products...</p>}>
        <CategoryTypes
          initialProducts={products}
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