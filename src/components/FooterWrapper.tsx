'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';

export default function FooterWrapper() {
    const pathname = usePathname();
    const disableFooterPaths = ['/dashboard', '/login', '/register', '/dashboard/scan'];
    const shouldHideFooter = disableFooterPaths.includes(pathname) || pathname.startsWith('/dashboard');
    if (shouldHideFooter) return null;
    return <Footer />;
}