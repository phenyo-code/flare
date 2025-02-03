import { prisma } from "../../lib/db/prisma";
import CategoryHeader from "../../components/CategoryHeader";
import HeroSection from "../../components/HeroSection";
import Header from "../../components/Header";
import ProductList from "../../components/ProductList";
import FreeDeliveryBanner from "@/components/FreeDelivery";

// Type for the category params
interface CategoryPageParams {
  category: string;
}

// Updated to handle async params resolution properly
export async function generateMetadata({ params }: { params: Promise<CategoryPageParams> }) {
  const { category } = await params; // Await the promise for params

  // Your metadata generation logic here, like fetching data for SEO or page title
  return {
    title: `Products in ${category}`,
    description: `Browse products in the ${category} category.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<CategoryPageParams> }) {
  const { category } = await params; // Await the promise for params

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
      <FreeDeliveryBanner />
      <Header />
      <CategoryHeader activeCategory={category.toUpperCase()} />
      <HeroSection product={products[0]} />
      <ProductList products={products} />
    </div>
  );
}
