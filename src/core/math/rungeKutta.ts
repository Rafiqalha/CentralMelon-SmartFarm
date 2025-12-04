/**
 * Interface untuk hasil simulasi per hari
 */
interface DecayStep {
    day: number;
    quality: number; // Persentase kualitas (0-100%)
}

/**
 * Fungsi Diferensial: dy/dt = -k * y
 * Laju pembusukan dipengaruhi oleh konstanta k (tergantung suhu gudang).
 * @param t Waktu (hari)
 * @param y Kualitas saat ini
 * @param k Konstanta laju pembusukan (misal: 0.1 di suhu ruang, 0.05 di kulkas)
 */
const decayFunction = (t: number, y: number, k: number): number => {
    return -k * y;
};

/**
 * Runge-Kutta 4th Order Implementation
 * Digunakan untuk memodelkan "Shelf Life" melon secara akurat.
 */
export const simulateMelonQuality = (
    initialQuality: number, // Biasanya 100%
    totalDays: number,      // Berapa hari simulasi berjalan
    decayRate: number       // Seberapa cepat busuk (0.01 - 0.5)
): DecayStep[] => {
    let t = 0;
    let y = initialQuality;
    const stepSize = 1; // Hitung per hari (bisa diperkecil jadi 0.1 untuk lebih akurat)
    const results: DecayStep[] = [];

    // Simpan kondisi awal
    results.push({ day: 0, quality: Number(y.toFixed(2)) });

    while (t < totalDays) {
        // Menghitung 4 slope (k1, k2, k3, k4)
        const k1 = stepSize * decayFunction(t, y, decayRate);
        const k2 = stepSize * decayFunction(t + 0.5 * stepSize, y + 0.5 * k1, decayRate);
        const k3 = stepSize * decayFunction(t + 0.5 * stepSize, y + 0.5 * k2, decayRate);
        const k4 = stepSize * decayFunction(t + stepSize, y + k3, decayRate);

        // Update nilai y (Kualitas) menggunakan rata-rata terbobot dari slope
        // y_new = y + (1/6)(k1 + 2k2 + 2k3 + k4)
        y = y + (k1 + 2 * k2 + 2 * k3 + k4) / 6;

        // Update waktu
        t = t + stepSize;

        // Jangan biarkan kualitas minus
        if (y < 0) y = 0;

        results.push({ day: Number(t.toFixed(1)), quality: Number(y.toFixed(2)) });
    }

    return results;
};