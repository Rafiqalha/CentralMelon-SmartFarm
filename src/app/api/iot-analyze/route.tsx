import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { sensors, devices } = await req.json();
        const apiKey = process.env.GOOGLE_AI_API_KEY;

        if (!apiKey) return NextResponse.json({ error: "API Key Missing" }, { status: 500 });

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
      Bertindaklah sebagai AI Agronomist Profesional untuk Greenhouse Melon Premium.
      
      DATA SENSOR REALTIME:
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

      TUGAS:
      1. Analisis kondisi tanaman saat ini (Stress/Optimal/Bahaya).
      2. Jelaskan kenapa perangkat tertentu menyala/mati (korelasikan dengan Rule Engine).
      3. Berikan prediksi singkat untuk 1 jam ke depan.
      4. Jangan pakai tanda * untuk teks

      Jawab dalam 1 paragraf pendek yang padat dan profesional. Bahasa Indonesia.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return NextResponse.json({ analysis: response.text() });

    } catch (error) {
        return NextResponse.json({ error: "Gagal analisis AI" }, { status: 500 });
    }
}