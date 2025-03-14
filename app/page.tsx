// app/page.tsx
import { prisma } from "./lib/db/prisma";
import Header from "./components/Header";
import CategoryHeader from "./components/CategoryHeader";
import Featured from "./components/Featured";
import FreeDeliveryBanner from "./components/FreeDelivery";
import InstallPrompt from "./components/InstallPrompt";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/options";
import StandaloneHeader from "./components/StandaloneHeader";
import CategoryTypes from "./components/CategoryTypes";

export const metadata = {
  title: "Discover the Latest Fashion Trends | FLARE South Africa",
  description:
    "Explore the latest fashion trends at FLARE South Africa. Shop trendy streetwear, vintage jackets, stylish apparel, and accessories with free delivery in South Africa.",
  keywords:
    "flare, FLARE, Flare, T-shirts, Shopping, South African Shops, South African Brands, Local Brands, fashion South Africa, FLARE South Africa, streetwear SA, vintage jackets, trendy apparel, free delivery South Africa, online fashion store, South African clothing, FLARE fashion, trendy jackets, modern streetwear, South African online store",
  openGraph: {
    title: "Discover the Latest Fashion Trends | FLARE South Africa",
    description:
      "Explore the latest fashion trends at FLARE South Africa. Shop trendy streetwear, vintage jackets, stylish apparel, and accessories with free delivery in South Africa.",
    images: ["/opengraph-image.png"],
    type: "website",
    url: "https://flare-shop.vercel.app/",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image.png"],
  },
};

export default async function Home() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { sizes: true, reviews: true },
  });

  const session = await getServerSession(authOptions);
  const cart = session
    ? await prisma.cart.findFirst({
        where: { userId: session.user.id },
        select: { id: true },
      })
    : null;

  const filters = Array.from(
    new Set(products.map((p) => p.filter).filter(Boolean))
  );

  const featuredProductName = "Vintage Multicolor Jacket Streetwear - FLARE Good";
  const featuredProduct = products.find((product) => product.name === featuredProductName);
  const selectedFeaturedProduct = featuredProduct || products[0];

  const processedProducts = products.map((product) => ({
    ...product,
    Originalprice: product.Originalprice ?? 0,
  }));

  // Enhanced JSON-LD for Home Page
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FLARE South Africa",
    "url": "https://flare-shop.vercel.app/",
    "description":
      "Explore the latest fashion trends at FLARE South Africa. Shop trendy streetwear, vintage jackets, stylish apparel, and accessories with free delivery in South Africa.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://flare-shop.vercel.app/search?query={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    "publisher": {
      "@type": "Organization",
      "name": "FLARE South Africa",
      "url": "https://flare-shop.vercel.app/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://flare-shop.vercel.app/logo.png",
      },
      "sameAs": [
        "https://twitter.com/flare_sa", // Replace with real social links
        "https://instagram.com/flare_sa",
        "https://facebook.com/flare_sa",
      ],
    },
    "mainEntity": {
      "@type": "CollectionPage",
      "name": "Latest Fashion Products at FLARE South Africa",
      "description": "Browse the newest streetwear and fashion items at FLARE.",
      "url": "https://flare-shop.vercel.app/",
      "mainEntity": {
        "@type": "ItemList",
        "name": "Featured Fashion Products",
        "numberOfItems": processedProducts.length,
        "itemListElement": processedProducts.slice(0, 5).map((product, index) => ({
          "@type": "Product",
          "position": index + 1,
          "name": product.name,
          "url": `https://flare-shop.vercel.app/product/${product.id}`,
          "image": product.images.length > 0 ? product.images[0] : "/default-product-image.png",
          "description": `Stylish ${product.category} ${product.filter} from FLARE South Africa - ${product.style || "trendy fashion"}`,
          "sku": product.id,
          "mpn": product.id,
          "brand": {
            "@type": "Brand",
            "name": product.style || "FLARE",
          },
          "offers": {
            "@type": "Offer",
            "price": product.price.toString(),
            "priceCurrency": "ZAR",
            "availability": product.sizes.some((size) => size.quantity > 0)
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
            "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            ...(product.Originalprice && product.Originalprice > product.price
              ? {
                  "priceSpecification": {
                    "@type": "PriceSpecification",
                    "price": product.Originalprice.toString(),
                    "priceCurrency": "ZAR",
                    "discount": `${(
                      ((product.Originalprice - product.price) / product.Originalprice) *
                      100
                    ).toFixed(0)}%`,
                  },
                }
              : {}),
          },
          ...(product.reviews.length > 0
            ? {
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": (
                    product.reviews.reduce((sum, r) => sum + r.rating, 0) /
                    product.reviews.length
                  ).toFixed(1),
                  "reviewCount": product.reviews.length,
                },
              }
            : {}),
        })),
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
      ],
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
      <CategoryHeader activeCategory="ALL" />
      <div>
        <Featured product={selectedFeaturedProduct} />
        <InstallPrompt />
        <CategoryTypes
          initialProducts={processedProducts}
          filters={filters}
          category="ALL"
          cartId={cart?.id}
        />
      </div>
      <InstallPrompt />
    </div>
  );
}