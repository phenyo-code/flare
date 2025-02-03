import { prisma } from "../lib/db/prisma"; // Adjust the import path if necessary
import Header from "../components/Header";
import CategoryHeader from "../components/CategoryHeader";
import Footer from "../components/Footer";
import Featured from "../components/Featured";
import PersonalizedProductList from "../components/PersonalizedProductList"; // Direct import
import InteractionMessage from "@/components/InteractionMessage";
import FreeDeliveryBanner from "@/components/FreeDelivery";

export const metadata = {
  title: "For You | FLARE",
};

export default async function ForYouPage() {
  // Fetch products from Prisma
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Specify the product name you want to feature (e.g., "Special Product Name")
  const featuredProductName = "Vintage Multicolor Jacket Streetwear - FLARE Good";

  // Find the featured product based on the product name
  const featuredProduct = products.find(product => product.name === featuredProductName);

  // If no product is found, you could either display a default or the first product in the list
  const selectedFeaturedProduct = featuredProduct || products[0];

  // Ensure every product has a default Originalprice
  const processedProducts = products.map((product) => ({
    ...product,
    Originalprice: product.Originalprice ?? 0, // Default to 0 if null
  }));

  // Check if there are any personalized products (this can be customized based on your logic)
  const hasPersonalizedProducts = processedProducts.length > 0; // Example condition, adjust based on your criteria

  return (
    <div>
      <FreeDeliveryBanner />
      <Header />
      <CategoryHeader activeCategory="FOR YOU" />
      <div>
        <Featured product={selectedFeaturedProduct} />
        
        {/* Conditionally render the PersonalizedProductList or InteractionMessage */}
        {hasPersonalizedProducts ? (
          <PersonalizedProductList allProducts={processedProducts} />
        ) : (
          <InteractionMessage />
        )}
      </div>
      <Footer />
    </div>
  );
}
