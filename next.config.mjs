/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'utfs.io',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'uploadthing.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'bp6tg6wst0.ufs.sh', // Add this entry
                port: '',
                pathname: '/**',
            },
        ],
    },
    productionBrowserSourceMaps: false, // Enable source maps
};

export default nextConfig;
