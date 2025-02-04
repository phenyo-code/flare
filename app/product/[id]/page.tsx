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
import Horizontal from "@/components/Horizontal";
import { FaTruck } from "react-icons/fa";


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
  let defaultAddress = null;

  if (session?.user) {
    cart = await prisma.cart.findFirst({ where: { userId: session.user.id } });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id, createdAt: new Date() },
      });
    }

    // Fetch the default shipping address
    defaultAddress = await prisma.shippingAddress.findFirst({
      where: { userId: session.user.id, isDefault: true },
    });
  }

 // Ensure every product has a default Originalprice
 // Example condition, adjust based on your criteria

  const discount = product.Originalprice
    ? ((product.Originalprice - product.price) / product.Originalprice) * 100
    : 0;

    const relatedProducts = await prisma.product.findMany({
      where: {
        filter: product.filter, // Assuming you want to show similar products based on the filter
        NOT: { id: product.id }, // Exclude the current product
      },
      take: 5, // Limit to 5 related products (you can adjust this)
    });

  return (
    <div className="overflow-hidden  min-h-screen">
      <SearchHeader />
      <div className="container bg-white mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* Image Slider Section */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <ImageWrapper images={product.images} />
          </div>

          {/* Product Details Section */}
          <div className="w-full lg:w-1/2 lg:pl-8 mt-2">
            <h3 className="text-2xl text-red-500 mt-2 ml-4 font-bold">
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
                Shop Now and Save {discount.toFixed(0)}% Off this {product.filter}
              </p>
            )}

            

            <div className="  pb-2 mt-4">
              <Sizes productId={product.id} sizes={product.sizes} cartId={cart?.id} />
            </div>
            
            <span className="w-full block bg-gray-100 h-2"></span> {/* Gray separator */}

            {/* Display Default Shipping Address */}
            {defaultAddress && (
              
              <div className=" flex p-4 rounded-md  border-t border-gray-100">
                <Link href="/addresses" className="block">
                <p className="text-sm font-semibold overflow-hidden text-ellipsis whitespace-nowrap mr-6">
                  Delivering to {defaultAddress.address}
                </p>
                <div className="flex items-center mt-2">
                  <FaTruck className="text-gray-600 " />
                <p className="text-xs text-gray-400 mx-2">Free delivery on orders over R1000</p>
                </div>
              </Link>

                {/* Link to Address Page */}
              </div>
            )}

<span className="w-full block bg-gray-100 h-2"></span> {/* Gray separator */}

        <p className="text-sm text-gray-600 ml-4 font-medium mb-2 mt-2">Similar</p>
         <Horizontal products={relatedProducts} /> {/* Pass products to Horizontal */}
           
   
          <span className="w-full block bg-gray-100 h-2"></span> {/* Gray separator */}
 

            <div className=" border-t border-gray-100 pb-4">
              <Reviews productId={product.id} />
            </div>

            <span className="w-full block bg-gray-100 h-2"></span> {/* Gray separator */}

            

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
