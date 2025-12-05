type DataPoint = {
    month: number;
    sales: number;
};

interface RegressionResult {
    slope: number;      
    intercept: number;
    prediction: number; 
    formula: string;    
}

export const calculateRegression = (data: DataPoint[]): RegressionResult => {
    const n = data.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (const point of data) {
        sumX += point.month;
        sumY += point.sales;
        sumXY += point.month * point.sales;
        sumXX += point.month * point.month;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    const nextMonth = data[n - 1].month + 1;
    const prediction = slope * nextMonth + intercept;

    return {
        slope,
        intercept,
        prediction: Math.round(prediction),
        formula: `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`,
    };
};