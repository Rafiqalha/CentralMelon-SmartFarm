import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { topic, difficulty } = await req.json();
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `
      Bertindaklah sebagai Dosen Agronomi Spesialis Melon.
      Buatkan 5 soal kuis interaktif tentang topik: "${topic}" dengan tingkat kesulitan "${difficulty}".
      
      Komposisi Soal:
      1. 2 Soal Pilihan Ganda (Multiple Choice) tentang teori dasar.
      2. 2 Soal Analisis Kasus (Scenario) dimana user harus memecahkan masalah kebun.
      3. 1 Soal Visual (Image Based). Untuk soal ini, berikan keyword gambar yang relevan di field 'imageKeyword' (contoh: "melon powdery mildew", "drip irrigation system"). Saya akan mencari gambarnya sendiri di frontend.


      Aturan Wajib:
      1. Jangan pernah pakai tanda * atau / di teks soal
      2. biarkan murni teks saja

      Output WAJIB JSON murni (Array of Objects):
      [
        {
          "type": "multiple_choice" | "analysis" | "visual",
          "question": "Pertanyaan...",
          "imageKeyword": "keyword gambar (hanya jika type visual, jika tidak kosongkan string)",
          "options": ["Opsi A", "Opsi B", "Opsi C", "Opsi D"],
          "correctAnswer": 0 (index jawaban benar 0-3),
          "explanation": "Penjelasan detail & edukatif kenapa jawaban itu benar (Max 3 kalimat)."
        }
      ]
      JANGAN gunakan markdown.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return NextResponse.json(JSON.parse(text));

    } catch (error) {
        console.error("Quiz Error:", error);
        return NextResponse.json({ error: "Gagal membuat kuis" }, { status: 500 });
    }
}