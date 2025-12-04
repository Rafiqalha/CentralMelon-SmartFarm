'use client';

export default function TrustContact() {
    return (
        <div className="w-full">
            {/* TESTIMONIALS */}
            <div className="py-20 bg-emerald-900 text-white">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-12">Kata Mitra & Pelanggan</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-left border border-white/10">
                            <p className="italic mb-6">"Pemasangan IoT dari Central Melon sangat membantu saya memantau kelembapan tanah dari rumah. Panen jadi lebih terukur."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-emerald-400 rounded-full"></div>
                                <div>
                                    <h4 className="font-bold">Bapak Hartono</h4>
                                    <p className="text-sm text-emerald-200">Petani Mitra, Blitar</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-left border border-white/10">
                            <p className="italic mb-6">"Melon Golden-nya manis banget! Teksturnya crunchy, beda sama yang di pasar biasa. Langganan buat hampers."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-purple-400 rounded-full"></div>
                                <div>
                                    <h4 className="font-bold">Ibu Sarah</h4>
                                    <p className="text-sm text-emerald-200">Customer, Surabaya</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTACT & CTA */}
            <div id="contact" className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6 bg-slate-900 rounded-3xl p-12 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-emerald-600/20 blur-3xl"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Siap Memulai Panen Premium?</h2>
                        <p className="text-gray-300 mb-10 text-lg">Konsultasikan kebutuhan greenhouse atau pesan melon premium sekarang.</p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="https://wa.me/6285709477872" className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full transition shadow-lg shadow-emerald-500/30">
                                Chat WhatsApp
                            </a>
                            <a href="mailto:halo@centralmelon.com" className="px-8 py-4 bg-white text-slate-900 font-bold rounded-full transition hover:bg-gray-100">
                                Kirim Email
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}