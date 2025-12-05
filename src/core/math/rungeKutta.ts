interface DecayStep {
    day: number;
    quality: number; 
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

export const simulateMelonQuality = (
    initialQuality: number, 
    totalDays: number,    
    decayRate: number       
): DecayStep[] => {
    let t = 0;
    let y = initialQuality;
    const stepSize = 1; 
    const results: DecayStep[] = [];

    results.push({ day: 0, quality: Number(y.toFixed(2)) });

    while (t < totalDays) {
        const k1 = stepSize * decayFunction(t, y, decayRate);
        const k2 = stepSize * decayFunction(t + 0.5 * stepSize, y + 0.5 * k1, decayRate);
        const k3 = stepSize * decayFunction(t + 0.5 * stepSize, y + 0.5 * k2, decayRate);
        const k4 = stepSize * decayFunction(t + stepSize, y + k3, decayRate);

        y = y + (k1 + 2 * k2 + 2 * k3 + k4) / 6;
        t = t + stepSize;

        if (y < 0) y = 0;
        results.push({ day: Number(t.toFixed(1)), quality: Number(y.toFixed(2)) });
    }
    return results;
};