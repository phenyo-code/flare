import { prisma } from "../../lib/db/prisma";
import CategoryHeader from "../../components/CategoryHeader";
import HeroSection from "../../components/HeroSection";
import Header from "../../components/Header";
import dynamic from "next/dynamic";
import FreeDeliveryBanner from "@/components/FreeDelivery";
import { Suspense } from "react";
import { Metadata } from "next";
import CategoryTypes from "../../components/CategoryTypes"; // Updated to use filters

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

export default async function CategoryPage({ params }: { params: Promise<CategoryPageParams> }) {
  const { category } = await params;

  // Fetch all products in the selected category
  const products = await prisma.product.findMany({
    where: {
      category: category.toUpperCase(),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Extract unique filters (filter out null/undefined and use Set for uniqueness)
  const filters = Array.from(new Set(products.map(p => p.filter).filter(f => f)));

  return (
    <div>
      <FreeDeliveryBanner />
      <Header />
      <CategoryHeader activeCategory={category} />
      {/* Pass products and filters to CategoryTypes for interactive filtering */}
      <CategoryTypes initialProducts={products} filters={filters} category={category} />
    </div>
  );
}