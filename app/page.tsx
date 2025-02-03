import { prisma } from "./lib/db/prisma";
import Header from "./components/Header";
import CategoryHeader from "./components/CategoryHeader";
import ProductList from "./components/ProductList";
import Footer from "./components/Footer";
import Featured from "./components/Featured";
import PersonalizedProductList from "./components/PersonalizedProductList"; // Direct import

export const metadata = {
  title: "Latest Products | FLARE",
};

export default async function Home() {
  // Fetch products from Prisma
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  // Specify the product name you want to feature (e.g., "Special Product Name")
  const featuredProductName = "Women's Hoodie";

  // Find the featured product based on the product name
  const featuredProduct = products.find(product => product.name === featuredProductName);

  // If no product is found, you could either display a default or the first product in the list
  const selectedFeaturedProduct = featuredProduct || products[0];

  // Ensure every product has a default Originalprice
  const processedProducts = products.map((product) => ({
    ...product,
    Originalprice: product.Originalprice ?? 0, // Default to 0 if null
  }));

  return (
    <div>
      <Header />
      <CategoryHeader activeCategory={""} />
      <div>

       
        {/* Pass the selected product to Featured */}
        <Featured product={selectedFeaturedProduct} />
        {/* Pass all products to PersonalizedProductList */}
        <PersonalizedProductList allProducts={processedProducts} />
        {/* Display all products */}
        <ProductList products={processedProducts} />
      </div>
      <Footer />
    </div>
  );
}
