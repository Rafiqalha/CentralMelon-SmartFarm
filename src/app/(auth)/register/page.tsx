'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // Pastikan path ini benar
import { Mail, Lock, User, ArrowLeft, Loader2, Leaf, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast'; // Wajib install react-hot-toast

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // --- LOGIKA REGISTER ---
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Daftar ke Supabase Auth
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName, // Simpan nama lengkap di metadata
                    },
                },
            });

            if (error) throw error;

            // 2. Sukses! (Supabase otomatis login setelah register jika email confirm mati)
            toast.success("Akun berhasil dibuat! Mengalihkan...");

            // Refresh router dan pindah ke home
            router.refresh();
            setTimeout(() => router.push('/'), 1500);

        } catch (err: any) {
            toast.error(err.message || "Gagal mendaftar.");
        } finally {
            setLoading(false);
        }
    };

    // --- LOGIKA GOOGLE ---
    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: `${window.location.origin}/auth/callback` },
            });
            if (error) throw error;
        } catch (err: any) {
            toast.error(err.message);
            setLoading(false);
        }
    };

    // Animasi Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.8, staggerChildren: 0.2 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    };

    return (
        <div className="flex min-h-screen bg-white overflow-hidden">
            {/* VISUAL */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="hidden lg:flex lg:w-1/2 bg-emerald-900 relative overflow-hidden"
            >
                <img
                    src="https://images.unsplash.com/photo-1508857650881-64475119d798?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Greenhouse Modern"
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-linear-to-t from-emerald-950 via-emerald-900/80 to-emerald-800/50"></div>
                <div className="relative z-10 p-16 flex flex-col justify-between h-full text-white">
                    <motion.div variants={itemVariants} className="bg-emerald-700/30 backdrop-blur-md p-3 rounded-2xl inline-block w-fit mb-8 border border-emerald-600/50">
                        <Leaf className="w-8 h-8 text-emerald-300" />
                    </motion.div>

                    <motion.div variants={containerVariants} initial="hidden" animate="visible">
                        <motion.h1 variants={itemVariants} className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
                            Bergabung dengan <br /><span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-300 to-teal-200">Komunitas Petani Modern.</span>
                        </motion.h1>
                        <motion.p variants={itemVariants} className="text-lg text-emerald-100/90 mb-10 leading-relaxed max-w-xl">
                            Dapatkan akses ke teknologi Smart Farming, pasar B2B eksklusif, dan modul pembelajaran agronomi bersertifikat.
                        </motion.p>
                    </motion.div>

                    <motion.p variants={itemVariants} className="text-sm text-emerald-300/70 mt-8">
                        © 2024 Central Melon. Agriculture 4.0 Platform.
                    </motion.p>
                </div>
            </motion.div>

            {/* FORM REGISTER */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-full lg:w-1/2 flex flex-col justify-center p-6 lg:p-16 bg-gray-50/50"
            >
                <div className="max-w-[450px] mx-auto w-full">
                    <Link href="/" className="inline-flex items-center text-gray-600 hover:text-emerald-600 transition-colors mb-8 group font-medium">
                        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Kembali ke Beranda
                    </Link>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-100/60 border border-white"
                    >
                        <motion.div variants={itemVariants} className="text-center mb-8">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Buat Akun Baru 🚀</h2>
                            <p className="text-gray-600">Mulai perjalanan pertanian cerdas Anda.</p>
                        </motion.div>

                        {/* Tombol Google */}
                        <motion.button
                            variants={itemVariants}
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            whileHover={{ scale: 1.01, backgroundColor: '#f8fafc' }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 px-6 py-3.5 rounded-xl hover:border-gray-300 transition-all font-semibold mb-8 group shadow-sm disabled:opacity-50"
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            Daftar dengan Google
                        </motion.button>

                        <div className="relative flex items-center mb-6">
                            <div className="grow border-t border-gray-200"></div>
                            <span className="shrink-0 mx-4 text-gray-500 text-xs font-bold uppercase bg-white px-2">Atau Email</span>
                            <div className="grow border-t border-gray-200"></div>
                        </div>

                        {/* Form Register */}
                        <form onSubmit={handleRegister} className="space-y-5">

                            {/* Input Nama Lengkap */}
                            <motion.div variants={itemVariants} className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-0 outline-none transition-all bg-gray-50/50 focus:bg-white"
                                    placeholder="Nama Lengkap"
                                    required
                                />
                            </motion.div>

                            {/* Input Email */}
                            <motion.div variants={itemVariants} className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-0 outline-none transition-all bg-gray-50/50 focus:bg-white"
                                    placeholder="Email Perusahaan"
                                    required
                                />
                            </motion.div>

                            {/* Input Password */}
                            <motion.div variants={itemVariants} className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-0 outline-none transition-all bg-gray-50/50 focus:bg-white"
                                    placeholder="Kata Sandi (Min. 6 Karakter)"
                                    required
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </motion.div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                variants={itemVariants}
                                whileHover={{ scale: 1.01, backgroundColor: '#047857' }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-600/30 transition-all mt-6 flex justify-center items-center gap-2 disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Daftar Sekarang'}
                            </motion.button>
                        </form>

                        <motion.p variants={itemVariants} className="text-center text-gray-600 mt-8 font-medium text-sm">
                            Sudah punya akun? <Link href="/login" className="text-emerald-600 hover:text-emerald-800 font-bold transition-colors hover:underline">Login di sini</Link>
                        </motion.p>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}