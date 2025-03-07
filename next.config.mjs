import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: false, // Force enable PWA in development
});

const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.unsplash.com" },
      { hostname: "plus.unsplash.com" },
      { hostname: "another-image-source.com" },
    ],
  },
  experimental: {
    serverActions: true, // Ensure this is correctly formatted
    metadataRoutes: true,
  },
  matcher: ["/product/:path*"],
};

export default withPWA(nextConfig);
