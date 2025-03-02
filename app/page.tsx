import { prisma } from "./lib/db/prisma";
import Header from "./components/Header";
import CategoryHeader from "./components/CategoryHeader";
import ProductList from "./components/ProductList";
import Footer from "./components/Footer";
import Featured from "./components/Featured";
import FreeDeliveryBanner from "./components/FreeDelivery";
import InstallPrompt from "./components/InstallPrompt";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";
import StandaloneHeader from "./components/StandaloneHeader";

export const metadata = {
  title: "Latest Products | FLARE",
};

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { sizes: true },
  });

  const session = await getServerSession(authOptions);
  const cart = session
    ? await prisma.cart.findFirst({
        where: { userId: session.user.id },
        select: { id: true },
      })
    : null;

  const featuredProductName = "Vintage Multicolor Jacket Streetwear - FLARE Good";
  const featuredProduct = products.find((product) => product.name === featuredProductName);
  const selectedFeaturedProduct = featuredProduct || products[0];

  const processedProducts = products.map((product) => ({
    ...product,
    Originalprice: product.Originalprice ?? 0,
  }));

  return (
    <div>
      <FreeDeliveryBanner />
      <StandaloneHeader />
      <Header />
      <CategoryHeader activeCategory={""} />
      <div>
        <Featured product={selectedFeaturedProduct} />
        <InstallPrompt />
        <ProductList products={processedProducts} cartId={cart?.id} />
      </div>
      <InstallPrompt />
      <Footer />
    </div>
  );
}