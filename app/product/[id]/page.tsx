import { prisma } from "../../lib/db/prisma"; // Ensure correct path
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/options";
import Image from "next/image";
import Link from "next/link";
import Sizes from "./Sizes";
import SearchHeader from "../../components/SearchHeader";
import Footer from "../../components/Footer";

// Ensure `params` is typed correctly as an object (no Promise!)
type ProductPageProps = {
  params: { id: string }; // Correct type for params
};

// Generate metadata for SEO, using the product ID
export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = params;

  // Fetch product details for metadata (like title, description)
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

// Main ProductDetails component
export default async function ProductDetails({ params }: ProductPageProps) {
  // Destructure the `id` from params (no need to await params, it's not a Promise)
  const { id } = params;

  // Fetch session data (user info)
  const session = await getServerSession(authOptions);

  // Fetch product details from the database using Prisma
  const product = await prisma.product.findUnique({
    where: { id },
    include: { sizes: true }, // Include sizes with the product details
  });

  // Handle case when product is not found
  if (!product) {
    return <p>Product not found.</p>;
  }

  let cart = null;
  if (session?.user) {
    // Fetch the user's cart or create a new one if not exists
    cart = await prisma.cart.findFirst({ where: { userId: session.user.id } });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id, createdAt: new Date() },
      });
    }
  }

  return (
    <div className="overflow-hidden">
      <SearchHeader />
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 flex justify-center">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={400}
              height={400}
              className="object-cover w-full"
            />
          </div>
          <div className="w-full lg:w-1/2 lg:pl-8 mx-4 mt-4">
            <h2 className="text-3xl font-semibold">{product.name}</h2>
            <p className="text-lg text-red-500 mt-2">R{product.price}</p>
            {/* Sizes Component - Pass product sizes and cart ID */}
            <Sizes productId={product.id} sizes={product.sizes} cartId={cart?.id} />

            {/* Display login prompt if user is not logged in */}
            {!session?.user && (
              <div className="text-center mt-10">
                <p className="text-lg text-gray-600">You need to log in to add items to the cart.</p>
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
      <Footer />
    </div>
  );
}
