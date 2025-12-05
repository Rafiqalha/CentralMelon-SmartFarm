import OpenAI from 'openai';
import { NextResponse } from "next/server";

const client = new OpenAI({
    apiKey: process.env.KOLOSAL_API_KEY,
    baseURL: 'https://api.kolosal.ai/v1'
});

export async function POST(req: Request) {
    try {
        const { tonase, durasi, rasa } = await req.json();

        if (!process.env.KOLOSAL_API_KEY) {
            return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
        }

        const prompt = `
            Bertindaklah sebagai Konsultan Supply Chain Pertanian (Procurement Expert).
            Klien B2B ingin membeli Melon Premium dengan data berikut:
            - Volume: ${tonase} Ton
            - Tipe Kontrak: ${durasi}
            - Preferensi Rasa: ${rasa}

            Tugasmu:
            1. Rekomendasikan varietas melon terbaik (Golden Apollo / Japanese Musk / Inthanon).
            2. Estimasi harga per Ton (dalam Rupiah) yang masuk akal untuk volume tersebut (diskon untuk volume besar).
            3. Berikan alasan logis kenapa varietas itu cocok (daya simpan, tekstur, dll).
            4. Berikan strategi penghematan (savings).

            Output WAJIB JSON murni tanpa markdown:
            {
                "variety": "Nama Varietas",
                "price_est": "Rp XX.XXX.XXX / Ton",
                "reason": "Alasan singkat (maks 2 kalimat)",
                "savings": "Potensi hemat (misal: Hemat 5% dengan kontrak 1 tahun)"
            }
        `;

        const completion = await client.chat.completions.create({
            model: 'Claude Sonnet 4.5',
            messages: [
                { role: "system", content: "Kamu adalah AI sistem backend yang hanya merespon dengan JSON valid." },
                { role: "user", content: prompt }
            ],
            temperature: 0.5,
            max_tokens: 300,
        });

        let text = completion.choices[0].message.content || "{}";

        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const jsonResult = JSON.parse(text);

        return NextResponse.json(jsonResult);

    } catch (error: any) {
        console.error("Procurement AI Error:", error);
        return NextResponse.json({ error: "Gagal menganalisis." }, { status: 500 });
    }
}