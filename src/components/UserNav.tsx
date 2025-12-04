'use client';

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { LogOut, User } from 'lucide-react';

export default function UserNav() {
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700">
                    <User size={16} />
                </div>
                <span>Administrator</span>
            </div>
            <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Logout"
            >
                <LogOut size={20} />
            </button>
        </div>
    );
}