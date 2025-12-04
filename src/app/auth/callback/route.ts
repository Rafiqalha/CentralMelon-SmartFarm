import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');

    // Default tujuan adalah Home ('/')
    let next = '/';

    if (code) {
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        try {
                            cookiesToSet.forEach(({ name, value, options }) =>
                                cookieStore.set(name, value, options)
                            );
                        } catch {
                            // Abaikan error di server component
                        }
                    },
                },
            }
        );

        // 1. Tukar Code jadi Session
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // 2. CEK ROLE USER SETELAH LOGIN
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                // 3. LOGIKA REDIRECT BERDASARKAN ROLE
                if (profile?.role === 'admin') {
                    next = '/dashboard'; // Admin masuk Dashboard
                } else {
                    next = '/'; // User biasa/Google masuk Home
                }
            }

            return NextResponse.redirect(`${requestUrl.origin}${next}`);
        }
    }

    // Jika gagal login, kembalikan ke halaman login
    return NextResponse.redirect(`${requestUrl.origin}/login?error=auth`);
}