import OpenAI from 'openai';
import { NextResponse } from "next/server";

const client = new OpenAI({
    apiKey: process.env.KOLOSAL_API_KEY,
    baseURL: 'https://api.kolosal.ai/v1'
});

export async function POST(req: Request) {
    try {
        const { sensors, devices } = await req.json();

        if (!process.env.KOLOSAL_API_KEY) {
            return NextResponse.json({ error: "Kolosal API Key Missing" }, { status: 500 });
        }

        const systemPrompt = `
            Bertindaklah sebagai AI Agronomist Profesional untuk Greenhouse Melon Premium.
            Tugasmu adalah menganalisis data sensor real-time dan memberikan insight singkat.
            
            DATA SENSOR SAAT INI:
            - Suhu: ${sensors.temp.toFixed(1)}°C
            - Kelembapan: ${sensors.humidity.toFixed(0)}%
            - Kelembapan Tanah: ${sensors.soil.toFixed(0)}%
            - Cahaya: ${sensors.light.toFixed(0)} Lux
            - Nutrisi (EC): ${sensors.ec.toFixed(1)} mS/cm
            - pH: ${sensors.ph.toFixed(1)}

            STATUS PERANGKAT OTOMATIS:
            - Cooling Fan: ${devices.fan ? 'MENYALA' : 'MATI'}
            - Pompa Irigasi: ${devices.pump ? 'MENYALA' : 'MATI'}
            - Shading Net: ${devices.shading ? 'MENUTUP' : 'TERBUKA'}
            - Katup Nutrisi: ${devices.valve ? 'TERBUKA' : 'TERTUTUP'}

            INSTRUKSI:
            1. Analisis kondisi tanaman saat ini (Stress/Optimal/Bahaya).
            2. Jelaskan alasan teknis kenapa perangkat tertentu menyala/mati.
            3. Berikan prediksi singkat 1 jam ke depan.
            
            ATURAN OUTPUT:
            - Jawab dalam 1 paragraf pendek yang padat (maksimal 3-4 kalimat).
            - Gunakan Bahasa Indonesia profesional.
            - JANGAN gunakan format markdown (bold/italic/bintang *). Hanya teks biasa.
        `;

        const completion = await client.chat.completions.create({
            model: 'Llama 4 Maverick',
            messages: [
                { role: 'system', content: 'Kamu adalah asisten IoT pertanian yang memberikan analisis singkat dan padat tanpa markdown.' },
                { role: 'user', content: systemPrompt }
            ],
            temperature: 0.3,
            max_tokens: 300, 
        });

        let analysisText = completion.choices[0].message.content || "Data tidak cukup untuk analisis.";

        analysisText = analysisText
            .replace(/\*\*/g, "")
            .replace(/\*/g, "")
            .replace(/#/g, "")
            .trim();

        return NextResponse.json({ analysis: analysisText });

    } catch (error: any) {
        console.error("Kolosal IoT Error:", error);
        return NextResponse.json({ error: "Gagal analisis AI (Kolosal)" }, { status: 500 });
    }
}