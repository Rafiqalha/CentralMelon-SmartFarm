import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Google API Key not found" }, { status: 500 });
    }

    // Gunakan Gemini 1.5 Flash (Paling Cepat & Stabil untuk Vision)
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Anda adalah AI Ahli Agronomi. Tugas anda adalah menganalisis gambar buah.

      Lakukan analisis langkah demi langkah:
      1. Deteksi Objek: Apakah gambar ini buah Melon? Jika BUKAN (manusia, mobil, dll), status "invalid".
      2. Analisis Kulit: Netting (jaring) dan warna.
      3. Identifikasi Varietas: (Rock Melon / Golden Apollo / Inthanon / dll).
      4. Estimasi Kualitas: Cacat fisik atau penyakit.
      5. Wajib gunakan bahasa indonesia
      
      Output WAJIB JSON murni:
      {
        "is_melon": true,
        "variety": "Nama Varietas",
        "skin_texture": "Deskripsi tekstur",
        "skin_color": "Warna kulit",
        "health_status": "Sehat/Cacat",
        "analysis": "Kesimpulan singkat (maks 2 kalimat).",
        "confidence": 95
      }

      Jika bukan melon:
      {
        "is_melon": false,
        "analysis": "Objek bukan melon."
      }
    `;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageBase64, mimeType: "image/jpeg" } }
    ]);
    
    const response = await result.response;
    let text = response.text();

    // Cleaning JSON
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const jsonResult = JSON.parse(text);

    return NextResponse.json(jsonResult);

  } catch (error: any) {
    console.error("MelonLens Error:", error);
    return NextResponse.json({ 
        error: "Gagal memproses gambar. Pastikan API Key Google valid." 
    }, { status: 500 });
  }
}