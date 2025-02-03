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
        serverActions: {
            // Specify any options here if needed, otherwise leave it empty
            enable: true, // You can remove this line if no extra configuration is needed.
          },
    },
};

export default nextConfig;
