/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'images.unsplash.com',
            },
            {
                hostname: 'plus.unsplash.com',
            },
            {
                hostname: 'another-image-source.com',
            },
        ],
    },
    experimental: {
        serverActions: {
            enable: true,
        },
    },
    matcher: ["/product/:path*"], // Ensure middleware runs only on product pages
};

export default nextConfig;

