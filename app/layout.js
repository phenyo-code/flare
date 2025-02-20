'use client';

import "./globals.css"; 
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import { Suspense } from "react";
import HomeLoading from "./loading";
import OfflineNotification from './components/OfflineNotification';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Global Open Graph Meta Tags */}
        <meta property="og:title" content="FLARE | Shop Latest Trends In Fashion" />
        <meta property="og:description" content="Discover the latest fashion trends and shop with confidence." />
        <meta property="og:image" content="/opengraph-image.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://flare-shop.vercel.app/" />
        <meta property="og:site_name" content="Your Website Name" />


        
        
        {/* Optionally, Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/opengraph-image.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-startup-image" href="/Splash.png" />
        
      </head>
      <body>
        <SessionProvider>
          <Suspense fallback={<HomeLoading />}>
            <OfflineNotification />
          {children}
          </Suspense>
        </SessionProvider>
      </body>
    </html>
  );
}
