import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // 1. HITUNG MATEMATIKA DULU (WAJIB JALAN)
    let layoutData = {
        total_beds: 0,
        pathway_width: "0 cm",
        total_capacity: 0
    };

    try {
        const { landWidth, landLength, plantType, location } = await req.json();

        // --- LOGIKA MATEMATIKA (HARD CODE) ---
        // Rumus: (Lebar Lahan - Buffer) / (Lebar Bedengan + Jalan)
        const bedWidth = 1.2; // meter (Standar Melon)
        const pathWidth = 0.8; // meter
        const laneWidth = bedWidth + pathWidth;

        // Kita asumsikan bedengan memanjang mengikuti sisi terpanjang lahan
        const longSide = Math.max(landWidth, landLength);
        const shortSide = Math.min(landWidth, landLength);

        const numberOfBeds = Math.floor((shortSide - 1) / laneWidth); // -1m untuk buffer pinggir
        const effectiveBedLength = longSide - 2; // -2m buffer depan belakang

        // Populasi: (Panjang Bedengan / 0.5m jarak tanam) * 2 baris (zigzag)
        const plantsPerBed = Math.floor(effectiveBedLength / 0.5) * 2;
        const totalCapacity = numberOfBeds * plantsPerBed;

        layoutData = {
            total_beds: numberOfBeds > 0 ? numberOfBeds : 0,
            pathway_width: "80 cm",
            total_capacity: totalCapacity > 0 ? totalCapacity : 0
        };

        // --- 2. LOGIKA AI (GEMINI) ---
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        let aiResult = null;

        if (apiKey) {
            try {
                const genAI = new GoogleGenerativeAI(apiKey);
                const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

                const prompt = `
              Bertindaklah sebagai Ahli Greenhouse. Berikan rekomendasi singkat JSON.
              Tanaman: ${plantType}, Lokasi: ${location}.
              
              Output JSON murni (tanpa markdown):
              {
                "type": "Jenis Greenhouse (cth: Tunnel / Sawtooth)",
                "reason": "Alasan singkat 1 kalimat",
                "frame_material": "Bahan rangka (cth: Galvanis, Bambu)",
                "specs": {
                  "column_height": "Tinggi (angka saja)",
                  "span_width": "Bentang (angka saja)",
                  "plastic_uv": "Jenis Plastik",
                  "insect_net": "Mesh waring",
                  "cooling": "Sistem pendingin"
                }
              }
            `;

                const result = await model.generateContent(prompt);
                const response = await result.response;
                let text = response.text();
                // Bersihkan format markdown ```json ... ```
                text = text.replace(/```json/g, "").replace(/```/g, "").trim();
                aiResult = JSON.parse(text);
            } catch (aiError) {
                console.error("Gemini Error (Limit/Network):", aiError);
                // Jika AI error, biarkan aiResult null, nanti kita pakai fallback
            }
        }

        // --- 3. FALLBACK DATA (JIKA AI GAGAL/LIMIT) ---
        // Ini data standar industri agar UI tidak kosong melompong
        const defaultSpecs = {
            type: "Standard Tunnel GH",
            reason: "Rekomendasi standar untuk efisiensi biaya dan sirkulasi udara yang cukup.",
            frame_material: "Pipa Galvanis 1.5 inch",
            specs: {
                column_height: "3.5",
                span_width: "6",
                plastic_uv: "UV 14% (200 Micron)",
                insect_net: "50 Mesh Insect Screen",
                cooling: "Ventilasi Alami / Exhaust Fan"
            }
        };

        // --- 4. MERGE HASIL AKHIR ---
        // Prioritas: Hasil AI -> kalau error pakai Default -> Gabung dengan hitungan Matematika
        const finalResult = {
            ...(aiResult || defaultSpecs), // Pakai AI, kalau null pakai Default
            layout: layoutData, // Data matematika pasti masuk
            // Mapping ulang agar sesuai UI jika format AI beda dikit
            cooling_system: aiResult?.specs?.cooling || defaultSpecs.specs.cooling
        };

        return NextResponse.json(finalResult);

    } catch (error) {
        console.error("Server Error:", error);
        // Return Fallback Terburuk (supaya app tidak crash)
        return NextResponse.json({
            type: "Basic Design",
            reason: "Mode offline: Menampilkan rekomendasi dasar.",
            frame_material: "Bambu / Kayu / Besi",
            specs: { column_height: 3, span_width: 5, plastic_uv: "UV 14%", insect_net: "40 Mesh" },
            layout: layoutData
        });
    }
}