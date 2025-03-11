// app/product/[id]/page.tsx
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
import { FaBoxOpen, FaTruck } from "react-icons/fa";
import MatchingProducts from "@/components/MatchingProducts";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    select: { name: true, category: true, filter: true, style: true },
  });

  return {
    title: product ? `${product.name} - Product Details | FLARE` : "Product Not Found",
    description: product
      ? `Discover ${product.name} at FLARE. Shop ${product.category} ${product.filter} by ${product.style || "FLARE"} with competitive prices and free delivery on orders over R1000.`
      : "This product does not exist or may have been removed.",
    keywords: product
      ? `${product.name}, ${product.category}, ${product.filter}, ${product.style || "FLARE"}, fashion, streetwear, FLARE shop`
      : "product not found",
  };
}

export default async function ProductDetails({ params }: ProductPageProps) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const product = await prisma.product.findUnique({
    where: { id },
    include: { sizes: true, reviews: { include: { user: true } } }, // Include user for review author
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
    defaultAddress = await prisma.shippingAddress.findFirst({
      where: { userId: session.user.id, isDefault: true },
    });
  }

  const discount = product.Originalprice
    ? ((product.Originalprice - product.price) / product.Originalprice) * 100
    : 0;

  const relatedProducts = await prisma.product.findMany({
    where: { filter: product.filter, NOT: { id: product.id } },
    take: 5,
  });

  const user = session?.user
    ? await prisma.user.findUnique({
        where: { email: session.user.email as string },
      })
    : null;

  // Enhanced JSON-LD for rich results (no <head> to avoid hydration issues)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images.length > 0 ? product.images : ["/default-product-image.png"],
    "description": `Explore ${product.name}, a stylish ${product.category} ${product.filter} from FLARE. Available in multiple sizes with free delivery on orders over R1000.`,
    "sku": product.id,
    "mpn": product.id, // Manufacturer Part Number, using ID as a fallback
    "brand": {
      "@type": "Brand",
      "name": product.style || "FLARE", // Use style as brand if available
    },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "url": `https://flare-shop.vercel.app/product/${product.id}`,
      "priceCurrency": "ZAR",
      "price": product.price.toString(),
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      "availability": product.sizes.some((size) => size.quantity > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      ...(product.Originalprice && discount > 0
        ? {
            "priceSpecification": {
              "@type": "PriceSpecification",
              "price": product.Originalprice.toString(),
              "priceCurrency": "ZAR",
              "discount": `${discount.toFixed(0)}%`,
            },
          }
        : {}),
    },
    ...(product.reviews.length > 0
      ? {
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": (
              product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
            ).toFixed(1),
            "reviewCount": product.reviews.length,
          },
          "review": product.reviews.map((review) => ({
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": review.user?.name || "Anonymous", // Use actual user name if available
            },
            "datePublished": review.createdAt.toISOString(),
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": review.rating.toString(),
            },
            "reviewBody": review.comment || "No comment provided.",
          })),
        }
      : {}),
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://flare-shop.vercel.app/" },
        {
          "@type": "ListItem",
          "position": 2,
          "name": product.category,
          "item": `https://flare-shop.vercel.app/category/${product.category.toLowerCase()}`,
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": product.name,
          "item": `https://flare-shop.vercel.app/product/${product.id}`,
        },
      ],
    },
  };

  return (
    <div className="overflow-hidden min-h-screen">
      {/* JSON-LD in body, no <head> */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SearchHeader placeholder={product ? product.filter : "Search for products..."} />
      <div className="container bg-white mx-auto mt-8">
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

            {product.Originalprice && discount > 0 && (
              <p className="border border-red-300 rounded-md max-w-max font-semibold text-xs sm:text-xs px-2 text-red-400 ml-4 mb-2 uppercase">
                {discount.toFixed(0)}% Off this {product.filter}
              </p>
            )}

            <div className="flex items-center mb-2">
              <p className="border px-1 py-1 rounded-lg ml-4 text-transparent bg-gradient-to-br from-black to-red-500 bg-clip-text text-sm font-extrabold tracking-widest uppercase">
                FLARE
              </p>
              <h3 className="text-lg font-semibold ml-1 truncate overflow-hidden whitespace-nowrap">
                {product.name}
              </h3>
            </div>

            <div className="pb-2 mt-4">
              <Sizes productId={product.id} sizes={product.sizes} cartId={cart?.id} />
            </div>

            <span className="w-full block bg-gray-100 h-2"></span>

            {session?.user && user && (
              <div className="flex p-4 rounded-md border-t border-gray-100">
                <div className="block">
                  <Link href="/profile">
                    <p className="text-sm font-semibold overflow-hidden text-ellipsis whitespace-nowrap mr-6">
                      Delivering for {user.name}
                    </p>
                  </Link>
                  <div className="flex items-center mt-2">
                    <FaTruck className="text-gray-600" />
                    <p className="text-xs text-gray-400 mx-2">
                      Free delivery on orders over R1000
                    </p>
                  </div>
                  <div className="pb-2 w-full">
                    <p className="text-xs text-gray-500 ml-6 mt-2">3-7 business days</p>
                  </div>
                  <div className="flex items-center mt-2">
                    <FaBoxOpen className="text-gray-600" />
                    <p className="text-xs text-gray-400 mx-2">Return Policy</p>
                  </div>
                </div>
              </div>
            )}

            {!session?.user && (
              <div className="text-center mt-10 mb-8">
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

            <span className="w-full block bg-gray-100 h-2"></span>

            <p className="text-sm text-gray-600 ml-4 font-medium mb-2 mt-2">Similar</p>
            <Horizontal products={relatedProducts} />

            <span className="w-full block bg-gray-100 h-2"></span>

            <div className="border-t border-gray-100 pb-4">
              <Reviews productId={product.id} />
            </div>

            <span className="w-full block bg-gray-100 h-2"></span>

            <p className="text-sm text-gray-600 ml-4 font-medium mb-2 mt-2">Matching Styles</p>
            <MatchingProducts productId={product.id} />
            <p className="text-sm text-gray-600 ml-4 font-medium mb-2 mt-2 whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="mr-4">#Matching</span>
              <span className="mr-4">#FLARE</span>
              <span className="mr-4">#{product.filter}</span>
              <span className="mr-4">#RelatedItems</span>
            </p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <Footer />
      </div>
    </div>
  );
}