// No "use client" here - this is a Server Component
import "./globals.css";
import { Metadata } from "next";
import Footer from "./components/Footer";
import ClientWrapper from "./ClientWrapper";

export const metadata: Metadata = {
  title: "FLARE | Shop Latest Trends In Fashion",
  description: "Discover the latest fashion trends and shop with confidence.",
  openGraph: {
    title: "FLARE | Shop Latest Trends In Fashion",
    description: "Discover the latest fashion trends and shop with confidence.",
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
    "name": "FLARE",
    "url": "https://flare-shop.vercel.app/",
    "description": "Discover the latest fashion trends and shop with confidence at FLARE.",
    "publisher": {
      "@type": "Organization",
      "name": "FLARE",
      "logo": {
        "@type": "ImageObject",
        "url": "https://flare-shop.vercel.app/logo.png",
      },
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://flare-shop.vercel.app/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
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
        <Footer />
      </body>
    </html>
  );
}