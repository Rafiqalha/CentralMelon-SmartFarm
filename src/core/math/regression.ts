// Tipe data untuk input (bulan ke-x, jumlah penjualan y)
type DataPoint = {
    month: number;
    sales: number;
};

// Interface hasil prediksi
interface RegressionResult {
    slope: number;      // Kemiringan garis (m)
    intercept: number;  // Titik potong (c)
    prediction: number; // Hasil prediksi bulan depan
    formula: string;    // String rumus untuk ditampilkan di UI
}

/**
 * Menghitung Simple Linear Regression secara manual
 * Rumus: y = mx + c
 * Digunakan untuk memprediksi permintaan melon agar petani tidak oversupply.
 */
export const calculateRegression = (data: DataPoint[]): RegressionResult => {
    const n = data.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    // Akumulasi data (Sigma)
    for (const point of data) {
        sumX += point.month;
        sumY += point.sales;
        sumXY += point.month * point.sales;
        sumXX += point.month * point.month;
    }

    // Menghitung Slope (m)
    // m = (n*Σxy - Σx*Σy) / (n*Σx² - (Σx)²)
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

    // Menghitung Intercept (c)
    // c = (Σy - m*Σx) / n
    const intercept = (sumY - slope * sumX) / n;

    // Prediksi bulan berikutnya (n + 1)
    const nextMonth = data[n - 1].month + 1;
    const prediction = slope * nextMonth + intercept;

    return {
        slope,
        intercept,
        prediction: Math.round(prediction), // Bulatkan karena penjualan barang utuh
        formula: `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`,
    };
};