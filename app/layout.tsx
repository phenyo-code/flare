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
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-startup-image" href="/Splash.png" />
      </head>
      <body>
        <ClientWrapper>{children}</ClientWrapper>
        <Footer />
      </body>
    </html>
  );
}