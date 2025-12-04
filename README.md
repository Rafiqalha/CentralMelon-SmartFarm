# 🍈 Central Melon - The Future of Smart Farming Ecosystem

> **Revolusi Pertanian 4.0: Dari Hulu (IoT & AI) hingga Hilir (B2B Supply Chain)**

![Central Melon Banner](<img width="1919" height="974" alt="image" src="https://github.com/user-attachments/assets/6af09c04-1259-4885-8648-981948a90629" />
)

## 📖 Tentang Proyek

**Central Melon** bukan sekadar e-commerce buah. Ini adalah ekosistem digital terintegrasi yang memberdayakan petani dengan teknologi presisi dan menghubungkan mereka langsung dengan pasar industri (B2B).

Kami menggabungkan **Hardware IoT** (Internet of Things), **Generative AI** (Agronomist Bot), dan **Sistem Rantai Pasok** dalam satu platform berbasis web yang *seamless*.

### 🏆 Poin Inovasi Utama (Hackathon Focus)
1.  **Web Serial API Implementation**: Mengontrol hardware fisik (Arduino/Servo) langsung dari browser tanpa backend server (Zero Latency).
2.  **Voice-Activated Interface**: Feedback suara "Jarvis" berbahasa Indonesia/Jawa saat interaksi IoT.
3.  **AI-Powered Agronomy**: Menggunakan **Kolosal (Claude Sonnet 4.5)** untuk diagnosa penyakit dan strategi tanam.
4.  **B2B Procurement Engine**: Dashboard khusus supplier dengan forecast panen dan simulasi harga dinamis.

---

## 🚀 Fitur & Teknologi

### 1. 🤖 AI MelonBot (Powered by Kolosal)
Asisten cerdas yang dilatih dengan data agronomi spesifik melon.
* **Model:** Claude Sonnet 4.5 via Kolosal API.
* **Kemampuan:** Diagnosa penyakit, rekomendasi nutrisi AB Mix, dan kalkulasi ROI.
* **Context Aware:** Mengingat riwayat percakapan.

### 2. ⚡ IoT Command Center (Real-time Hardware)
Dashboard monitoring dan kontrol greenhouse.
* **Dual Mode:** Mendukung **Real Hardware** (Web Serial) dan **Simulation Mode** (untuk demo tanpa alat).
* **Fitur:**
    * Buka/Tutup Pintu Greenhouse (Servo).
    * Monitoring Jarak/Keamanan (Ultrasonic).
    * Voice Feedback ("Sugeng Rawuh...").
    * Visualisasi Data Real-time (Recharts).

### 3. 🏭 B2B Wholesale Portal
Katalog khusus untuk pembeli skala besar (Hotel/Pabrik/Supermarket).
* **Spec-First UI:** Fokus pada Brix, MOQ, dan Kapasitas Supply.
* **AI Procurement Assistant:** Menghitung estimasi harga berdasarkan volume tonase.
* **Supply Forecast:** Grafik prediksi panen.

### 4. 🎓 Agro Education & Greenhouse Designer
* **Gamified Quiz:** Kuis interaktif dengan konten visual.
* **Curriculum:** Modul pembelajaran terstruktur.

---

## 🛠️ Tech Stack

* **Frontend:** [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Animations:** [GSAP](https://gsap.com/) & Framer Motion
* **Database & Auth:** [Supabase](https://supabase.com/)
* **AI Engine:** [Kolosal API](https://kolosal.ai/) & OpenAI SDK
* **Hardware Comms:** Web Serial API
* **IoT Hardware:** Arduino Uno, HC-SR04, Servo SG90

---

## ⚙️ Panduan Instalasi (Local Setup)

Ikuti langkah ini untuk menjalankan proyek di komputer lokal Anda.

### 1. Clone Repository
```bash
git clone [https://github.com/Rafiqalha/CentralMelon-SmartFarm.git](https://github.com/Rafiqalha/CentralMelon-SmartFarm.git)
cd central-melon
