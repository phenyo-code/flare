import { prisma } from "../../lib/db/prisma";
import { Product } from "@prisma/client";
import CategoryHeader from "../../components/CategoryHeader";
import HeroSection from "../../components/HeroSection";
import Header from "../../components/Header";
import ProductList from "../../components/ProductList";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params;

  // Fetch all products in the selected category
  const products = await prisma.product.findMany({
    where: {
      category: category.toUpperCase(), // Ensure case-insensitive matching
    },
    orderBy: {
      createdAt: "desc", // Order by the latest products
    },
  });

  return (
    <div>
      <Header />
      {/* Category Navigation */}
      <CategoryHeader activeCategory={category.toUpperCase()} />

      {/* Hero Section */}
      <HeroSection product={products[0]} /> {/* Display the latest product in the Hero section */}

      {/* Product List */}
      <ProductList products={products} /> {/* Pass the list of products */}
    </div>
  );
}
