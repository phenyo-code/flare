import { prisma } from "./lib/db/prisma";
import HeroSection from "./components/HeroSection";
import Header from "./components/Header";
import CategoryHeader from "./components/CategoryHeader";
import ProductList from "./components/ProductList";

// Fetch products asynchronously (for demonstration, use `getServerSideProps` here)
export default async function Home() {
    // Fetch products within an async function
    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    return (
        <div>
        <Header />
        <CategoryHeader activeCategory={""} />
        <div>
            {/* Pass the first product to HeroSection */}
            <HeroSection product={products[0]} />
            <ProductList products={products} />

        </div>
        </div>
    );
}
