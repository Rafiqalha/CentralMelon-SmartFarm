# 🍈 Central Melon - The Future of Smart Farming Ecosystem

> **Revolusi Pertanian 4.0: Platform Ekosistem Agrikultur Terintegrasi dari Hulu (IoT & AI) hingga Hilir (B2B Supply Chain).**

![Hero Banner](docs/hero-banner.png) 
*(Ganti dengan screenshot Hero Section Anda)*

[![Vercel Deploy](https://deploy.vercel.com/button)](https://central-melon.vercel.app) 
**[Lihat Live Demo Aplikasi](https://central-melon.vercel.app)**

---

## Latar Belakang & Masalah

Pertanian melon konvensional menghadapi tiga masalah utama:
1.  **Ketidakpastian Kualitas:** Sulit memprediksi kemanisan (Brix) dan grade buah tanpa teknologi.
2.  **Inefisiensi Operasional:** Penyiraman dan kontrol iklim masih manual.
3.  **Rantai Pasok Terputus:** Petani sulit menjangkau pembeli industri (B2B) seperti hotel dan supermarket secara langsung.

**Solusi:**
**Central Melon** hadir sebagai "Sistem Operasi" untuk pertanian modern. Kami menggabungkan sensor IoT untuk presisi tanam, AI untuk agronomi cerdas, dan Marketplace B2B untuk kepastian pasar.

---

## Fitur Unggulan (Innovation)

Aplikasi ini mengimplementasikan teknologi *bleeding edge* (Advanced Tech Bonus):

### 1. Artificial Intelligence (AI)
* **MelonBot (Kolosal/Claude 4.5):** Asisten chat cerdas untuk konsultasi penyakit dan strategi bisnis.
* **MelonLens (Computer Vision):** Deteksi kualitas dan varietas melon hanya dari foto menggunakan Gemini 2.0 Vision.
* **AI Greenhouse Designer:** Generator blueprint konstruksi greenhouse otomatis berdasarkan luas lahan.
* **Procurement AI:** Asisten negosiasi harga dan estimasi kontrak untuk pembeli B2B.

### 2. Real-time IoT Command Center
* **Web Serial API:** Mengontrol hardware fisik (Arduino/Servo) langsung dari browser tanpa latensi server.
* **Voice Feedback ("Jarvis"):** Sistem memberikan respon suara (TTS) berbahasa Indonesia saat perangkat diaktifkan.
* **Digital Twin:** Mode simulasi realtime untuk monitoring suhu, kelembapan, dan nutrisi.

### 3. B2B Supply Chain Engine
* **Spec-First Catalog:** Katalog khusus supplier dengan data teknis (Brix, MOQ, Capacity).
* **Dynamic Pricing:** Grafik tren harga pasar real-time.
* **Integrated POS:** Sistem kasir offline yang tersinkronisasi dengan stok gudang online.

---

## Arsitektur & Teknologi

Kami menggunakan arsitektur modern yang *scalable* dan aman:

* **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS.
* **Visual & Animasi:** GSAP (GreenSock), Framer Motion, Recharts.
* **Backend & Database:** Supabase (PostgreSQL, Auth, Storage, Realtime Subscriptions).
* **AI Engine:** Google Gemini API & Kolosal API (OpenAI Compatible).
* **Hardware Communication:** Web Serial API (Browser-to-Hardware).

---

## Galeri Aplikasi

| **Cinematic Homepage** | **IoT Dashboard (Dark Mode)** |
|:---:|:---:|
| ![Home](docs/home.png) | ![IoT](docs/iot.png) |
| *Landing page interaktif dengan GSAP* | *Kontrol hardware realtime & simulasi* |

| **AI MelonLens** | **B2B Catalog** |
|:---:|:---:|
| ![Lens](docs/lens.png) | ![Catalog](docs/catalog.png) |
| *Deteksi penyakit tanaman visual* | *Portal pengadaan khusus industri* |

*(Pastikan Anda mengupload screenshot ke folder `docs/` di repo Anda agar gambar muncul)*

---

## Panduan Instalasi (Lokal)

Ikuti langkah ini untuk menjalankan proyek di komputer Anda.

### Prasyarat
* Node.js v18+
* NPM / Yarn

### 1. Clone Repository
```bash
git clone [https://github.com/Rafiqalha/centralmelon-smartfarm.git](https://github.com/Rafiqalha/centralmelon-smartfarm.git)
cd central-melon