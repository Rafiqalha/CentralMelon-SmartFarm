import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { productName, category } = await req.json();
        const apiKey = process.env.GOOGLE_AI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "API Key not found di .env.local" }, { status: 500 });
        }

        const prompt = `
      Buatkan deskripsi produk B2B (Business to Business) yang profesional, menarik, dan mewah untuk buah Melon.
      
      Nama Produk: ${productName}
      Kategori: ${category}

      Instruksi Deskripsi:
      
        1. Jelaskan tekstur melon secara detail, mulai dari kerapatan daging, tingkat kerenyahan, kelembutan, hingga juiciness-nya.
        2. Soroti rasa manis dengan menyebutkan tingkat kemanisan atau brix secara spesifik, termasuk konsistensi manisnya di setiap panen.
        3. Tegaskan kualitas premium dengan menambahkan detail seperti warna daging, aroma segar, keseragaman ukuran, ketahanan simpan, dan proses seleksi ketat.
        4. Gunakan bahasa Indonesia yang persuasif, profesional, dan elegan yang cocok untuk menarik minat supplier, hotel, dan supermarket.
        5. Tulis hanya maksimal dua kalimat panjang yang menyatukan seluruh detail tersebut agar terdengar seperti deskripsi produk komersial premium.
        6. Jangan gunakan markdown, format khusus, atau simbol — hasil akhir harus berupa teks polos saja.
    `;

        // --- UPDATE: GUNAKAN GEMINI 2.0 FLASH (Sesuai list akunmu) ---
        // Kita pakai endpoint 'v1beta' karena model 2.0 biasanya ada di sana
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const googleResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await googleResponse.json();

        // Cek error dari Google
        if (!googleResponse.ok) {
            console.error("Google API Error:", JSON.stringify(data, null, 2));
            throw new Error(data.error?.message || "Gagal menghubungi Google AI");
        }

        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
            throw new Error("AI tidak menghasilkan teks.");
        }

        return NextResponse.json({ caption: generatedText });

    } catch (error: any) {
        console.error("Server Error:", error);
        return NextResponse.json({
            error: error.message || "Terjadi kesalahan internal"
        }, { status: 500 });
    }
}