import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import Link from "next/link";
import Sizes from "./Sizes";
import SearchHeader from "@/components/SearchHeader";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";
import Reviews from "./Reviews";
import ImageWrapper from "./ImageWrapper";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    select: { name: true },
  });

  return {
    title: product ? `${product.name} - Product Details` : "Product Not Found",
    description: product
      ? `Check out the details of ${product.name}. Available in different sizes and prices.`
      : "This product does not exist or may have been removed.",
  };
}

export default async function ProductDetails({ params }: ProductPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const product = await prisma.product.findUnique({
    where: { id },
    include: { sizes: true },
  });

  if (!product) {
    notFound();
  }

  let cart = null;
  if (session?.user) {
    cart = await prisma.cart.findFirst({ where: { userId: session.user.id } });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id, createdAt: new Date() },
      });
    }
  }

  const discount = product.Originalprice
  ? ((product.Originalprice - product.price) / product.Originalprice) * 100
  : 0;

  return (
    <div className="overflow-hidden">
      <SearchHeader />
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* Image Slider Section */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <ImageWrapper images={product.images} />
          </div>

          {/* Product Details Section */}
          <div className="w-full lg:w-1/2 lg:pl-8 mt-2">
            <h3 className="text-3xl text-red-500 mt-2 ml-4 font-bold">
              R{product.price}
            </h3>

            <div className="flex items-center mb-2">
              <p className="border px-1 py-1 rounded-lg ml-4 text-transparent bg-gradient-to-br from-black to-red-500 bg-clip-text text-sm font-extrabold tracking-widest uppercase">
                FLARE
              </p>
              <h3 className="text-lg font-semibold ml-1 truncate overflow-hidden whitespace-nowrap">
                {product.name}
              </h3>
             
            </div>

            {product.Originalprice && discount > 0 && (
              <p className="font-semibold text-sm sm:text-xs px-2 text-red-500 ml-2 mb-2 uppercase">
                Shop Now and Save {discount.toFixed(0)}%  Off this {product.filter}
              </p>
            )}



            <div className="shadow-md pb-2 mt-4">
              <Sizes productId={product.id} sizes={product.sizes} cartId={cart?.id} />
            </div>
            <div className="shadow-md mt-4 border-t pb-4">
              <Reviews productId={product.id} />
            </div>

            {!session?.user && (
              <div className="text-center mt-10">
                <p className="text-lg text-gray-600">
                  You need to log in to add items to the cart.
                </p>
                <Link href="/login">
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 mt-4">
                    Login
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Footer />
      </div>
    </div>
  );
}
