import { prisma } from "@/lib/db/prisma";
import CategoryHeader from "@/components/CategoryHeader";
import Header from "@/components/Header";
import StandaloneHeader from "@/components/StandaloneHeader";
import FreeDeliveryBanner from "@/components/FreeDelivery";
import ProductList from "@/components/ProductList";
import Image from "next/image";
import { Suspense } from "react";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/api/auth/[...nextauth]/options";
import { storeCategoryView } from "@/utils/cookies";
import { notFound } from "next/navigation";

interface BrandPageParams {
  brand: string;
}

export async function generateMetadata({ params }: { params: Promise<BrandPageParams> }): Promise<Metadata> {
  const { brand } = await params;
  const capitalizedBrand = brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase();
  return {
    title: `${capitalizedBrand} | FLARE`,
    description: `Explore all ${capitalizedBrand} products at FLARE. Shop trendy ${capitalizedBrand} streetwear and apparel with free delivery on orders over R1000.`,
    keywords: `${capitalizedBrand}, fashion, streetwear, apparel, FLARE shop, free delivery`,
  };
}

// Server-side component
async function BrandPageServer({ brand }: BrandPageParams) {
  const products = await prisma.product.findMany({
    where: { style: { equals: brand, mode: "insensitive" } },
    orderBy: { createdAt: "desc" },
    include: { sizes: true, reviews: true },
  });

  if (products.length === 0) {
    return notFound();
  }

  const logo = products[0].logo;
  const session = await getServerSession(authOptions);
  const cart = session
    ? await prisma.cart.findFirst({
        where: { userId: session.user.id },
        select: { id: true },
      })
    : null;

  // JSON-LD for Brand Page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase()} - FLARE`,
    "description": `Explore all ${brand} products at FLARE. Shop trendy ${brand} streetwear and apparel with free delivery on orders over R1000.`,
    "url": `https://flare-shop.vercel.app/brand/${brand.toLowerCase()}`,
    "publisher": {
      "@type": "Organization",
      "name": "FLARE",
      "logo": {
        "@type": "ImageObject",
        "url": "https://flare-shop.vercel.app/logo.png",
      },
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://flare-shop.vercel.app/",
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Brands",
          "item": "https://flare-shop.vercel.app/brands",
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": brand.charAt(0).toUpperCase() + brand.slice(1).toLowerCase(),
          "item": `https://flare-shop.vercel.app/brand/${brand.toLowerCase()}`,
        },
      ],
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": `${brand} Products`,
      "itemListElement": products.slice(0, 10).map((product, index) => ({
        "@type": "Product",
        "position": index + 1,
        "name": product.name,
        "url": `https://flare-shop.vercel.app/product/${product.id}`,
        "image": product.images.length > 0 ? product.images[0] : "/default-product-image.png",
        "description": `Stylish ${product.category} ${product.filter} by ${product.style} from FLARE`,
        "sku": product.id,
        "brand": {
          "@type": "Brand",
          "name": product.style,
          "logo": product.logo || "https://flare-shop.vercel.app/default-brand-logo.png",
        },
        "offers": {
          "@type": "Offer",
          "price": product.price.toString(),
          "priceCurrency": "ZAR",
          "availability": product.sizes.some((size) => size.quantity > 0)
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
        "aggregateRating": product.reviews.length > 0
          ? {
              "@type": "AggregateRating",
              "ratingValue": (
                product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
              ).toFixed(1),
              "reviewCount": product.reviews.length.toString(),
            }
          : undefined,
      })),
    },
  };

  return (
    <div>
      
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      
      <FreeDeliveryBanner />
      <StandaloneHeader />
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          {logo && (
            <Image
              src={logo}
              alt={`${brand} logo`}
              width={80}
              height={80}
              className="mr-6 rounded-full"
            />
          )}
          <h1 className="text-xl font-semibold text-gray-800 capitalize">{brand}</h1>
        </div>

        <Suspense fallback={<p>Loading products...</p>}>
          <ProductList products={products} cartId={cart?.id} />
        </Suspense>
      </div>
    </div>
  );
}

// Client-side wrapper to track category views
export default async function BrandPage({ params }: { params: Promise<BrandPageParams> }) {
  const { brand } = await params;

  if (typeof window !== "undefined") {
    storeCategoryView("BRANDS");
  }

  return <BrandPageServer brand={brand} />;
}