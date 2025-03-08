// app/layout.tsx
import "./globals.css";
import { Metadata } from "next";
import Footer from "./components/Footer";
import ClientWrapper from "./ClientWrapper";
import { ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "FLARE | Shop Latest Trends In Fashion",
  description: "Discover the latest fashion trends and shop with confidence at FLARE South Africa.",
  keywords:
    "flare, FLARE, Flare, fashion, streetwear, South Africa, trendy apparel, vintage jackets, online shopping, free delivery",
  openGraph: {
    title: "FLARE | Shop Latest Trends In Fashion",
    description: "Discover the latest fashion trends and shop with confidence at FLARE South Africa.",
    images: ["/opengraph-image.png"],
    type: "website",
    url: "https://flare-shop.vercel.app/",
    siteName: "FLARE",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FLARE South Africa",
    "url": "https://flare-shop.vercel.app/",
    "description":
      "Discover the latest fashion trends and shop trendy streetwear, vintage jackets, and accessories with confidence at FLARE South Africa.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://flare-shop.vercel.app/search?query={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
    "publisher": {
      "@type": "Organization",
      "name": "FLARE South Africa",
      "url": "https://flare-shop.vercel.app/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://flare-shop.vercel.app/logo.png",
        "width": "512",
        "height": "512",
      },
      "sameAs": [
        "https://twitter.com/flare_sa", // Replace with real social links
        "https://instagram.com/flare_sa",
        "https://facebook.com/flare_sa",
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "support@flare-shop.com", // Replace with real email
        "url": "https://flare-shop.vercel.app/contact",
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
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-startup-image" href="/Splash.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <ClientWrapper>{children}</ClientWrapper>
        <ToastContainer position="top-right" autoClose={3000} />
        <Footer />
      </body>
    </html>
  );
}