'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Sprout, LogOut, LayoutDashboard, User as UserIcon, ChevronDown, ShoppingCart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useCart } from '@/context/CartContext';

const NAV_LINKS = [
    { name: 'Home', href: '/' },
    { name: 'Tentang', href: '/about' },
    { name: 'Layanan', href: '/services' },
    { name: 'Katalog', href: '/products' },
    { name: 'Kontak', href: '/contact' },
];

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { totalItems } = useCart();

    const supabase = createClient();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);

            if (session?.user) {
                const { data } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', session.user.id)
                    .single();
                setRole(data?.role ?? 'customer');
            } else {
                setRole(null);
            }
        };

        fetchUserData();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (!session) setRole(null);
            else fetchUserData();
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const hasDarkHero =
        pathname === '/' ||
        pathname === '/about' ||
        pathname === '/services' ||
        pathname.startsWith('/services/') ||
        pathname.startsWith('/tools/');

    const isSolidNavbar = isScrolled || !hasDarkHero || isMobileMenuOpen;

    const textColorClass = isSolidNavbar ? 'text-slate-900' : 'text-white';
    const hoverColorClass = isSolidNavbar ? 'hover:text-emerald-600' : 'hover:text-emerald-300';
    const logoBgClass = isSolidNavbar ? 'bg-emerald-500 text-white' : 'bg-white text-emerald-600';

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsProfileOpen(false);
        setUser(null);
        setRole(null);
        router.push('/');
        router.refresh();
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${isSolidNavbar
                    ? 'bg-white/90 backdrop-blur-md shadow-sm border-gray-200/50 py-3'
                    : 'bg-transparent border-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">

                {/* --- LOGO --- */}
                <Link href="/" className="flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className={`p-2 rounded-xl transition-colors duration-300 shadow-lg ${logoBgClass}`}>
                        <Sprout size={24} strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col">
                        <h1 className={`text-xl font-bold tracking-tight leading-none transition-colors duration-300 ${textColorClass}`}>
                            Central Melon
                        </h1>
                        <p className={`text-[10px] font-bold tracking-[0.2em] uppercase mt-0.5 transition-colors duration-300 ${isSolidNavbar ? 'text-emerald-600' : 'text-emerald-300'}`}>
                            Premium Farm
                        </p>
                    </div>
                </Link>

                {/* --- DESKTOP MENU --- */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-medium transition-all duration-300 relative group ${textColorClass} ${hoverColorClass}`}
                            >
                                {link.name}
                                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${isActive ? 'w-full bg-emerald-500' : 'bg-emerald-400'}`}></span>
                            </Link>
                        );
                    })}
                </div>

                {/* --- RIGHT ACTIONS --- */}
                <div className="hidden md:flex items-center gap-5">
                    <Link href="/checkout" className={`relative p-2 rounded-full transition-colors ${textColorClass} hover:bg-black/5`}>
                        <ShoppingCart size={22} />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-bounce">
                                {totalItems}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className={`flex items-center gap-3 pr-4 pl-2 py-1.5 rounded-full border transition-all ${isSolidNavbar
                                        ? 'bg-gray-100 border-gray-200 hover:bg-gray-200 text-slate-800'
                                        : 'bg-white/10 border-white/20 hover:bg-white/20 text-white backdrop-blur-sm'
                                    }`}
                            >
                                {user.user_metadata.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-8 h-8 rounded-full border-2 border-emerald-500 object-cover" />
                                ) : (
                                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-sm">
                                        <UserIcon size={16} />
                                    </div>
                                )}
                                <div className="text-left hidden lg:block">
                                    <p className="text-xs font-bold leading-none max-w-[100px] truncate">
                                        {user.user_metadata.full_name || 'User'}
                                    </p>
                                    <p className={`text-[9px] leading-none mt-1 uppercase font-bold ${isSolidNavbar ? 'text-emerald-600' : 'text-emerald-300'}`}>
                                        {role}
                                    </p>
                                </div>
                                <ChevronDown size={14} className={`transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isProfileOpen && (
                                <div className="absolute right-0 top-full mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200 ring-1 ring-black/5">
                                    <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                                        <p className="text-xs text-gray-500 font-medium mb-1">Akun Terdaftar</p>
                                        <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        {role === 'admin' && (
                                            <Link href="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-colors">
                                                <LayoutDashboard size={18} className="text-emerald-600" /> Dashboard Admin
                                            </Link>
                                        )}
                                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left">
                                            <LogOut size={18} /> Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link href="/login">
                            <button className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 ${isSolidNavbar
                                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                                    : 'bg-white text-emerald-900 hover:bg-emerald-50'
                                }`}>
                                Login
                            </button>
                        </Link>
                    )}
                </div>

                {/* --- MOBILE TOGGLE --- */}
                <button
                    className={`md:hidden p-2 rounded-lg transition-colors ${isSolidNavbar ? 'text-slate-900 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* --- MOBILE MENU --- */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 shadow-2xl p-6 flex flex-col gap-2 animate-in slide-in-from-top-5 min-h-[calc(100vh-80px)]">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-lg font-bold px-4 py-3 rounded-xl transition-colors ${pathname === link.href
                                    ? 'bg-emerald-50 text-emerald-600'
                                    : 'text-slate-600 hover:bg-gray-50 hover:text-slate-900'
                                }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <hr className="border-gray-100 my-2" />
                    <Link
                        href="/checkout"
                        className="flex items-center justify-between text-lg font-bold px-4 py-3 rounded-xl text-slate-600 hover:bg-gray-50"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        <span>Keranjang</span>
                        {totalItems > 0 && <span className="bg-emerald-600 text-white text-xs px-2.5 py-1 rounded-full">{totalItems} Item</span>}
                    </Link>
                    <hr className="border-gray-100 my-2" />
                    {user ? (
                        <div className="bg-gray-50 p-4 rounded-2xl mt-auto">
                            <div className="flex items-center gap-3 mb-4">
                                <img src={user.user_metadata.avatar_url || 'https://via.placeholder.com/40'} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                                <div>
                                    <p className="font-bold text-slate-900">{user.user_metadata.full_name}</p>
                                    <p className="text-xs text-slate-500 uppercase">{role}</p>
                                </div>
                            </div>
                            {role === 'admin' && (
                                <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                                    <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg mb-2">
                                        <LayoutDashboard size={20} /> Dashboard
                                    </button>
                                </Link>
                            )}
                            <button onClick={handleLogout} className="w-full py-3 bg-white border border-gray-200 text-red-500 rounded-xl font-bold flex items-center justify-center gap-2">
                                <LogOut size={20} /> Logout
                            </button>
                        </div>
                    ) : (
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                            <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-xl mt-4">
                                Login Member
                            </button>
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}