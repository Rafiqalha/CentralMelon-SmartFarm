/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // 1. Konfigurasi Supabase (Jangan dihapus)
      {
        protocol: 'https',
        hostname: 'xpntsqenifslywuuelks.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      // 2. Konfigurasi Unsplash (BARU)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;