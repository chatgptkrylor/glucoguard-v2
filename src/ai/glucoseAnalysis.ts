/**
 * Glucose Analysis
 * Calculates HbA1c, time-in-range, and other diabetes metrics
 */

import { GlucoseReading, calculateVariability } from './predictiveAlerts';

export interface TimeInRange {
  percentage: number;
  low: number;    // < 70 mg/dL
  inRange: number; // 70-180 mg/dL
  high: number;   // > 180 mg/dL
  veryHigh: number; // > 250 mg/dL
}

export interface GlucoseStatistics {
  average: number;
  median: number;
  min: number;
  max: number;
  standardDeviation: number;
  coefficientOfVariation: number;
  timeInRange: TimeInRange;
  estimatedHbA1c: number;
  gmi: number; // Glucose Management Indicator
}

export interface DailyStats {
  date: string;
  average: number;
  readings: number;
  timeInRange: number;
}

// Calculate comprehensive glucose statistics
export function analyzeGlucoseData(readings: GlucoseReading[]): GlucoseStatistics {
  if (readings.length === 0) {
    return {
      average: 0,
      median: 0,
      min: 0,
      max: 0,
      standardDeviation: 0,
      coefficientOfVariation: 0,
      timeInRange: { percentage: 0, low: 0, inRange: 0, high: 0, veryHigh: 0 },
      estimatedHbA1c: 0,
      gmi: 0
    };
  }
  
  const values = readings.map(r => r.value);
  
  // Basic statistics
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  // Standard deviation
  const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
  const standardDeviation = Math.sqrt(variance);
  const coefficientOfVariation = (standardDeviation / average) * 100;
  
  // Time in range
  const timeInRange = calculateTimeInRange(readings);
  
  // Estimated HbA1c
  const estimatedHbA1c = estimateHbA1c(average);
  
  // Glucose Management Indicator (GMI)
  const gmi = calculateGMI(average);
  
  return {
    average: Math.round(average),
    median,
    min,
    max,
    standardDeviation: Math.round(standardDeviation * 10) / 10,
    coefficientOfVariation: Math.round(coefficientOfVariation * 10) / 10,
    timeInRange,
    estimatedHbA1c: Math.round(estimatedHbA1c * 10) / 10,
    gmi: Math.round(gmi * 10) / 10
  };
}

// Calculate time in range
export function calculateTimeInRange(readings: GlucoseReading[]): TimeInRange {
  if (readings.length === 0) {
    return { percentage: 0, low: 0, inRange: 0, high: 0, veryHigh: 0 };
  }
  
  const total = readings.length;
  const low = readings.filter(r => r.value < 70).length;
  const inRange = readings.filter(r => r.value >= 70 && r.value <= 180).length;
  const high = readings.filter(r => r.value > 180 && r.value <= 250).length;
  const veryHigh = readings.filter(r => r.value > 250).length;
  
  return {
    percentage: Math.round((inRange / total) * 100),
    low: Math.round((low / total) * 100),
    inRange: Math.round((inRange / total) * 100),
    high: Math.round((high / total) * 100),
    veryHigh: Math.round((veryHigh / total) * 100)
  };
}

// Estimate HbA1c from average glucose
// Formula: HbA1c (%) = (Average Glucose (mg/dL) + 46.7) / 28.7
export function estimateHbA1c(averageGlucose: number): number {
  return (averageGlucose + 46.7) / 28.7;
}

// Calculate Glucose Management Indicator (GMI)
// Formula: GMI (%) = 3.31 + 0.02392 × Average Glucose (mg/dL)
export function calculateGMI(averageGlucose: number): number {
  return 3.31 + 0.02392 * averageGlucose;
}

// Calculate glucose metrics for different time periods
export function getPeriodStats(
  readings: GlucoseReading[],
  period: 'day' | 'week' | 'month'
): GlucoseStatistics {
  const now = new Date();
  let cutoffDate: Date;
  
  switch (period) {
    case 'day':
      cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'week':
      cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
  }
  
  const periodReadings = readings.filter(r => r.timestamp >= cutoffDate);
  return analyzeGlucoseData(periodReadings);
}

// Get daily statistics for trend chart
export function getDailyStats(readings: GlucoseReading[]): DailyStats[] {
  if (readings.length === 0) return [];
  
  // Group by date
  const grouped = readings.reduce((acc, reading) => {
    const date = reading.timestamp.toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(reading);
    return acc;
  }, {} as { [date: string]: GlucoseReading[] });
  
  // Calculate stats for each day
  return Object.entries(grouped)
    .map(([date, dayReadings]) => {
      const values = dayReadings.map(r => r.value);
      const avg = values.reduce((a, b) => a + b, 0) / values.length;
      const tir = calculateTimeInRange(dayReadings);
      
      return {
        date,
        average: Math.round(avg),
        readings: dayReadings.length,
        timeInRange: tir.percentage
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Calculate average glucose by time of day
export function getGlucoseByTimeOfDay(readings: GlucoseReading[]): {
  morning: number;    // 6-12
  afternoon: number;  // 12-18
  evening: number;    // 18-22
  night: number;      // 22-6
} {
  const periods = {
    morning: readings.filter(r => {
      const hour = r.timestamp.getHours();
      return hour >= 6 && hour < 12;
    }),
    afternoon: readings.filter(r => {
      const hour = r.timestamp.getHours();
      return hour >= 12 && hour < 18;
    }),
    evening: readings.filter(r => {
      const hour = r.timestamp.getHours();
      return hour >= 18 && hour < 22;
    }),
    night: readings.filter(r => {
      const hour = r.timestamp.getHours();
      return hour >= 22 || hour < 6;
    })
  };
  
  return {
    morning: periods.morning.length > 0
      ? Math.round(periods.morning.reduce((sum, r) => sum + r.value, 0) / periods.morning.length)
      : 0,
    afternoon: periods.afternoon.length > 0
      ? Math.round(periods.afternoon.reduce((sum, r) => sum + r.value, 0) / periods.afternoon.length)
      : 0,
    evening: periods.evening.length > 0
      ? Math.round(periods.evening.reduce((sum, r) => sum + r.value, 0) / periods.evening.length)
      : 0,
    night: periods.night.length > 0
      ? Math.round(periods.night.reduce((sum, r) => sum + r.value, 0) / periods.night.length)
      : 0
  };
}

// Interpret HbA1c value
export function interpretHbA1c(hba1c: number): {
  category: 'excellent' | 'good' | 'fair' | 'poor' | 'dangerous';
  description: string;
  recommendation: string;
} {
  if (hba1c < 5.7) {
    return {
      category: 'excellent',
      description: 'Normal (non-diabetic range)',
      recommendation: 'Continue your current management plan'
    };
  } else if (hba1c < 6.5) {
    return {
      category: 'good',
      description: 'Prediabetes range',
      recommendation: 'Monitor closely and consider lifestyle modifications'
    };
  } else if (hba1c < 7.0) {
    return {
      category: 'good',
      description: 'ADA target for most adults with diabetes',
      recommendation: 'Good control - maintain current regimen'
    };
  } else if (hba1c < 8.0) {
    return {
      category: 'fair',
      description: 'Above target - action needed',
      recommendation: 'Review diet, exercise, and medication with your doctor'
    };
  } else if (hba1c < 9.0) {
    return {
      category: 'poor',
      description: 'High risk for complications',
      recommendation: 'Urgent medical consultation recommended'
    };
  } else {
    return {
      category: 'dangerous',
      description: 'Very high risk - immediate action required',
      recommendation: 'See your doctor immediately'
    };
  }
}

// Interpret Time in Range
export function interpretTIR(tir: number): {
  category: 'excellent' | 'good' | 'fair' | 'poor';
  description: string;
  recommendation: string;
} {
  if (tir >= 70) {
    return {
      category: 'excellent',
      description: 'TIR goal achieved',
      recommendation: 'Excellent glucose control - continue current management'
    };
  } else if (tir >= 60) {
    return {
      category: 'good',
      description: 'Near target',
      recommendation: 'Good control - minor adjustments may help reach 70%+'
    };
  } else if (tir >= 50) {
    return {
      category: 'fair',
      description: 'Below target',
      recommendation: 'Review glucose patterns and discuss with your doctor'
    };
  } else {
    return {
      category: 'poor',
      description: 'Significantly below target',
      recommendation: 'Urgent review of diabetes management plan needed'
    };
  }
}

// Generate comprehensive report
export function generateGlucoseReport(readings: GlucoseReading[]): {
  summary: string;
  statistics: GlucoseStatistics;
  interpretations: {
    hba1c: ReturnType<typeof interpretHbA1c>;
    tir: ReturnType<typeof interpretTIR>;
  };
  byTimeOfDay: ReturnType<typeof getGlucoseByTimeOfDay>;
  recommendations: string[];
} {
  const stats = analyzeGlucoseData(readings);
  const hba1cInterpretation = interpretHbA1c(stats.estimatedHbA1c);
  const tirInterpretation = interpretTIR(stats.timeInRange.percentage);
  const byTimeOfDay = getGlucoseByTimeOfDay(readings);
  
  const recommendations: string[] = [];
  
  if (stats.timeInRange.percentage < 70) {
    recommendations.push(`Work to improve Time in Range from ${stats.timeInRange.percentage}% to 70%+`);
  }
  
  if (stats.coefficientOfVariation > 36) {
    recommendations.push('High glucose variability detected - focus on consistent meal timing and carbohydrate counting');
  }
  
  if (byTimeOfDay.morning > stats.average + 20) {
    recommendations.push('Morning glucose is elevated - discuss dawn phenomenon with your doctor');
  }
  
  if (byTimeOfDay.night < 80) {
    recommendations.push('Nighttime lows detected - consider a small snack before bed');
  }
  
  recommendations.push('Continue regular glucose monitoring and follow up with your healthcare provider');
  
  return {
    summary: `Over the analyzed period, your average glucose was ${stats.average} mg/dL with an estimated HbA1c of ${stats.estimatedHbA1c}%. Your Time in Range is ${stats.timeInRange.percentage}%.`,
    statistics: stats,
    interpretations: {
      hba1c: hba1cInterpretation,
      tir: tirInterpretation
    },
    byTimeOfDay,
    recommendations
  };
}

// Export utility functions
export {
  calculateVariability
};
