/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: 'images.unsplash.com',
            },
            {
                hostname: 'plus.unsplash.com', // Add another hostname here
            },
            {
                hostname: 'another-image-source.com', // Add more hostnames as needed
            },
        ],
    },
    experimental: {
        serverActions: true,
    },
};

export default nextConfig;
