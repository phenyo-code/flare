import { prisma } from "./lib/db/prisma";
import HeroSection from "./components/HeroSection";
import Header from "./components/Header";

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
        <div>
            {/* Pass the first product to HeroSection */}
            <HeroSection product={products[0]} />
        </div>
        </div>
    );
}
