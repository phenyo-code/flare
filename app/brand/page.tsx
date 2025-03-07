import { prisma } from "@/lib/db/prisma";
import HorizontalCard from "@/components/HorizontalCard";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";
import FreeDeliveryBanner from "@/components/FreeDelivery";
import StandaloneHeader from "@/components/StandaloneHeader";
import Header from "@/components/Header";
import CategoryHeader from "@/components/CategoryHeader";

export const metadata = {
  title: "Brands | FLARE",
  description: "Discover top fashion brands at FLARE. Shop trendy streetwear and apparel from your favorite brands with free delivery on orders over R1000.",
  keywords: "brands, fashion, streetwear, apparel, FLARE shop, free delivery",
};

export default async function BrandsPage() {
  const products = await prisma.product.findMany({
    include: { sizes: true, reviews: true },
    orderBy: { createdAt: "desc" },
  });

  const brandsMap = new Map<string, { logo?: string | null; products: typeof products }>();
  products.forEach((product) => {
    if (product.style) {
      const existing = brandsMap.get(product.style) || { logo: product.logo, products: [] };
      brandsMap.set(product.style, {
        logo: existing.logo || product.logo,
        products: [...existing.products, product],
      });
    }
  });

  const brands = Array.from(brandsMap.entries()).map(([style, { logo, products }]) => ({
    brandName: style,
    logo,
    products: products.slice(0, 4),
  }));

  // JSON-LD for Brands Page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Brands - FLARE",
    "description": "Discover top fashion brands at FLARE. Shop trendy streetwear and apparel from your favorite brands with free delivery on orders over R1000.",
    "url": "https://flare-shop.vercel.app/brands",
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
      ],
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Featured Brands",
      "itemListElement": brands.map((brand, index) => ({
        "@type": "Brand",
        "position": index + 1,
        "name": brand.brandName,
        "url": `https://flare-shop.vercel.app/brand/${brand.brandName.toLowerCase()}`,
        "logo": brand.logo || "https://flare-shop.vercel.app/default-brand-logo.png",
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
      <CategoryHeader activeCategory="BRANDS" />
      <div className="max-w-7xl py-10 bg-gray-100 sm:px-2 lg:px-2">
        <h1 className="text-xl font-semibold text-gray-800 ml-4 mb-8">Explore Our Brands</h1>

        {brands.length === 0 ? (
          <div className="text-center text-gray-600">
            <p className="text-xl">No brands available yet.</p>
          </div>
        ) : (
          <div className="bg-gray-100 rounded-lg px-2">
            {brands.map((brand) => (
              <div key={brand.brandName}>
                <div className="bg-white border rounded-md p-4 mx-0 transition-shadow mb-2">
                  <div className="flex items-center mb-6">
                    {brand.logo && (
                      <Image
                        src={brand.logo}
                        alt={`${brand.brandName} logo`}
                        width={60}
                        height={60}
                        className="mr-4 rounded-full"
                      />
                    )}
                    <div>
                      <Link
                        href={`/brand/${brand.brandName.toLowerCase()}`}
                        className="text-xl font-semibold hover:underline flex items-center"
                      >
                        {brand.brandName}
                        <IoIosArrowForward className="ml-2 text-gray-500" />
                      </Link>
                    </div>
                  </div>

                  <div className="flex overflow-x-auto space-x-4">
                    {brand.products.map((product) => (
                      <div key={product.id} className="flex-shrink-0">
                        <HorizontalCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}