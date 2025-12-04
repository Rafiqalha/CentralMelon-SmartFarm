'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

export default function FooterWrapper() {
    const pathname = usePathname();

    // Daftar halaman yang TIDAK BOLEH ada footer
    const disableFooterPaths = ['/dashboard', '/login', '/register', '/dashboard/scan'];

    // Cek apakah pathname saat ini ada di daftar disable, atau diawali dengan /dashboard
    const shouldHideFooter = disableFooterPaths.includes(pathname) || pathname.startsWith('/dashboard');

    if (shouldHideFooter) return null;

    return <Footer />;
}