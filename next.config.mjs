/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com', // Allow Unsplash
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'xpntsqenifslywuuelks.supabase.co', // Allow Supabase (Keep this)
                port: '',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },
};

export default nextConfig;