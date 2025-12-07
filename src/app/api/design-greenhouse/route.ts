import OpenAI from 'openai';
import { NextResponse } from "next/server";

const client = new OpenAI({
    apiKey: process.env.KOLOSAL_API_KEY,
    baseURL: 'https://api.kolosal.ai/v1'
});

export async function POST(req: Request) {
    console.log("===== NEW REQUEST RECEIVED (GREENHOUSE DESIGNER) =====");

    let requestBody;
    try {
        requestBody = await req.json();
        console.log("User Input:", requestBody);
    } catch {
        console.log("INVALID JSON BODY");
        return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { landWidth, landLength, plantType, location } = requestBody;

    console.log("Running server-side math...");

    const bedWidth = 1.2;
    const pathWidth = 0.8;
    const laneWidth = bedWidth + pathWidth;
    const longSide = Math.max(landWidth, landLength);
    const shortSide = Math.min(landWidth, landLength);
    const numberOfBeds = Math.floor((shortSide - 1) / laneWidth);
    const effectiveBedLength = longSide - 2;
    const plantsPerBed = Math.floor(effectiveBedLength / 0.5) * 2;
    const totalCapacity = numberOfBeds * plantsPerBed;
    const layoutData = {
        total_beds: Math.max(numberOfBeds, 0),
        pathway_width: "80 cm",
        total_capacity: Math.max(totalCapacity, 0)
    };

    console.log("Layout Calculation:", layoutData);

    let aiResult = null;

    if (process.env.KOLOSAL_API_KEY) {
        try {
            console.log("Calling Llama 4 Maverick...");

            const systemPrompt = `
            Anda adalah Arsitek Greenhouse Profesional. Tugas anda adalah memberikan rekomendasi teknis.
            Hasilkan output HANYA dalam format JSON valid tanpa teks tambahan.
            
            Input Data:
            - Tanaman: ${plantType}
            - Lokasi: ${location}
            - Luas: ${landWidth}x${landLength}m

            Format JSON yang diharapkan:
            {
                "type": "Jenis Greenhouse (cth: Tropical Sawtooth)",
                "reason": "Alasan teknis singkat (max 15 kata)",
                "frame_material": "Spesifikasi Rangka (cth: Galvanis 2 inch)",
                "specs": {
                    "column_height": "Tinggi Tiang (angka meter)",
                    "span_width": "Lebar Bentang (angka meter)",
                    "plastic_uv": "Jenis Plastik UV (cth: 200 Micron 14%)",
                    "insect_net": "Ukuran Mesh (cth: 50 Mesh)",
                    "cooling": "Sistem Pendingin (cth: Exhaust Fan / Alami)"
                }
            }
            `;

            const completion = await client.chat.completions.create({
                model: 'Llama 4 Maverick',
                messages: [
                    { role: "system", content: "You are a JSON generator backend system. Output valid JSON only." },
                    { role: "user", content: systemPrompt }
                ],
                temperature: 0.5, 
                max_tokens: 600,
            });

            let rawText = completion.choices[0].message.content || "{}";

            console.log("RAW Llama OUTPUT:");
            console.log(rawText);
            rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();

            const start = rawText.indexOf("{");
            const end = rawText.lastIndexOf("}");
            if (start !== -1 && end !== -1) {
                rawText = rawText.substring(start, end + 1);
            }

            console.log("CLEANED JSON TEXT:");
            console.log(rawText);

            aiResult = JSON.parse(rawText);
            console.log("PARSED AI JSON RESULT SUCCESS");

        } catch (err: any) {
            console.log("Llama ERROR:", err);
        }
    } else {
        console.warn("Kolosal API Key Missing");
    }

    const fallback = {
        type: "Standard Tunnel GH (Offline)",
        reason: "Koneksi AI terputus, menampilkan rekomendasi standar.",
        frame_material: "Pipa Galvanis 1.5 inch",
        specs: {
            column_height: "3.5",
            span_width: "6",
            plastic_uv: "UV 14% (200 Micron)",
            insect_net: "50 Mesh Insect Screen",
            cooling: "Ventilasi Alami"
        }
    };

    const finalResult = {
        ...(aiResult || fallback),
        layout: layoutData,
        cooling_system: aiResult?.specs?.cooling || aiResult?.cooling_system || fallback.specs.cooling
    };

    console.log("FINAL RESULT:");
    console.log(finalResult);
    console.log("===== REQUEST COMPLETED =====\n");

    return NextResponse.json(finalResult);
}