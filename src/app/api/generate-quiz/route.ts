import OpenAI from 'openai';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.KOLOSAL_API_KEY,
  baseURL: 'https://api.kolosal.ai/v1'
});

export async function POST(req: Request) {
  let requestBody;
  try {
    requestBody = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { topic, difficulty } = requestBody;

  const systemPrompt = `
        Bertindaklah sebagai Dosen Agronomi Spesialis Melon.
        Buatkan 5 soal kuis interaktif tentang: "${topic}" (${difficulty}).
        
        Komposisi Soal (Wajib 5):
        1. 2 Soal Pilihan Ganda (Teori Dasar)
        2. 2 Soal Analisis Kasus (Problem Solving)
        3. 1 Soal Visual (Image Based) - WAJIB ada keyword gambar Inggris spesifik.
        
        Aturan Penting:
        - Output WAJIB JSON Array murni.
        - JANGAN gunakan markdown (\`\`\`).
        - Penjelasan jawaban harus padat & jelas (Maksimal 2 kalimat) agar respon cepat.

        Format JSON:
        [
            {
                "type": "multiple_choice",
                "question": "...",
                "imageKeyword": "",
                "options": ["A", "B", "C", "D"],
                "correctAnswer": 0,
                "explanation": "Penjelasan singkat."
            },
            ... (ulangi sampai 5 soal)
        ]
    `;

  try {
    console.log("Mencoba Generate 5 Soal dengan Kolosal...");

    if (!process.env.KOLOSAL_API_KEY) throw new Error("No Kolosal Key");

    const completion = await client.chat.completions.create({
      model: 'Claude Sonnet 4.5',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Buatkan 5 soal sekarang.' }
      ],
      temperature: 0.5,
      max_tokens: 4000,
    });

    let text = completion.choices[0].message.content || "[]";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    if (!text.endsWith(']')) {
      throw new Error("JSON Terpotong (Incomplete)");
    }

    console.log("Sukses 5 Soal via Kolosal!");
    return NextResponse.json(JSON.parse(text));

  } catch (kolosalError: any) {
    console.error("Kolosal Gagal...", kolosalError.message);

  }
}