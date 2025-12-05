import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    let layoutData = {
        total_beds: 0,
        pathway_width: "0 cm",
        total_capacity: 0
    };

    try {
        const { landWidth, landLength, plantType, location } = await req.json();
        const bedWidth = 1.2;
        const pathWidth = 0.8; 
        const laneWidth = bedWidth + pathWidth;
        const longSide = Math.max(landWidth, landLength);
        const shortSide = Math.min(landWidth, landLength);
        const numberOfBeds = Math.floor((shortSide - 1) / laneWidth); 
        const effectiveBedLength = longSide - 2; 
        const plantsPerBed = Math.floor(effectiveBedLength / 0.5) * 2;
        const totalCapacity = numberOfBeds * plantsPerBed;

        layoutData = {
            total_beds: numberOfBeds > 0 ? numberOfBeds : 0,
            pathway_width: "80 cm",
            total_capacity: totalCapacity > 0 ? totalCapacity : 0
        };

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
                text = text.replace(/```json/g, "").replace(/```/g, "").trim();
                aiResult = JSON.parse(text);
            } catch (aiError) {
                console.error("Gemini Error (Limit/Network):", aiError);
            }
        }

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

        const finalResult = {
            ...(aiResult || defaultSpecs), 
            layout: layoutData, 
            cooling_system: aiResult?.specs?.cooling || defaultSpecs.specs.cooling
        };

        return NextResponse.json(finalResult);

    } catch (error) {
        console.error("Server Error:", error);
        return NextResponse.json({
            type: "Basic Design",
            reason: "Mode offline: Menampilkan rekomendasi dasar.",
            frame_material: "Bambu / Kayu / Besi",
            specs: { column_height: 3, span_width: 5, plastic_uv: "UV 14%", insect_net: "40 Mesh" },
            layout: layoutData
        });
    }
}