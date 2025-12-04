# 🍈 Central Melon - Premium Smart Farming Ecosystem

> Platform ekosistem pertanian modern yang mengintegrasikan IoT, AI Agronomist, dan Supply Chain B2B untuk revolusi pertanian melon premium.

## 🌟 Fitur Unggulan (Innovation Score)

1.  **AI Agronomist (Gemini 2.0)** 🧠
    * Konsultasi penyakit tanaman real-time.
    * Desain Greenhouse otomatis berdasarkan luas lahan.
    * Kalkulasi ROI dan estimasi panen.

2.  **IoT Real-time Control (Web Serial API)** ⚡
    * Monitoring suhu & kelembapan live.
    * Kontrol hardware fisik (pintu/kipas) langsung dari browser tanpa latensi server.
    * Voice Feedback "Jarvis" (Text-to-Speech) interaktif.

3.  **B2B Wholesale Portal** 🏭
    * Sistem pemesanan kontrak untuk supplier/hotel.
    * Analisis tren harga pasar dan forecast panen.

4.  **Gamified Education** 🎓
    * Kuis interaktif untuk petani pemula.
    * Modul pembelajaran berbasis kurikulum.

## 🛠️ Teknologi (Architecture Score)

* **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS.
* **Animations:** GSAP (GreenSock), Framer Motion.
* **AI:** Google Gemini API (Generative AI).
* **Database & Auth:** Supabase.
* **IoT Communication:** Web Serial API (Direct Browser-to-Hardware).
* **Charts:** Recharts.

## 🚀 Cara Menjalankan Project (Local Installation)

Pastikan Anda memiliki **Node.js** (v18+) dan **NPM** terinstal.

1.  **Clone Repository**
    ```bash
    git clone [https://github.com/USERNAME_GITHUB_ANDA/central-melon.git](https://github.com/USERNAME_GITHUB_ANDA/central-melon.git)
    cd central-melon
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Buat file `.env.local` di root folder dan isi key berikut:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
    GOOGLE_AI_API_KEY=your_gemini_api_key
    ```

4.  **Jalankan Server**
    ```bash
    npm run dev
    ```
    Buka [http://localhost:3000](http://localhost:3000) di browser.

## 📸 Screenshots

*(Masukkan screenshot halaman Home, Dashboard IoT, dan Katalog di sini)*

---
**Tim Central Melon** - Hackathon 2024