import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    let address = "";
    try {
        const body = await req.json();
        address = body.address || "";

        const apiKey = process.env.GOOGLE_AI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: "API Key not found" }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `
      Anda adalah asisten logistik cerdas. Tugas anda adalah membuat Link Google Maps Search yang akurat berdasarkan alamat yang ditulis user (Indonesia).

      Input Alamat: "${address}"

      Instruksi:
      1. Perbaiki jika ada typo pada nama jalan, kecamatan, atau kota di Indonesia.
      2. Tambahkan konteks "Indonesia" jika belum ada.
      3. Buat URL Google Maps Search dengan format: https://www.google.com/maps/search/?api=1&query=...
      4. Pastikan URL di-encode dengan benar (contoh: spasi jadi + atau %20).
      
      Output WAJIB JSON murni:
      {
        "map_link": "https://www.google.com/maps/search/..."
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const jsonResult = JSON.parse(text);
        return NextResponse.json(jsonResult);

    } catch (error: any) {
        console.error("Location AI Error:", error);
        const safeAddress = address ? encodeURIComponent(address) : "Indonesia";
        const fallbackLink = `https://www.google.com/maps/search/?api=1&query=${safeAddress}`;
        return NextResponse.json({ map_link: fallbackLink });
    }
}