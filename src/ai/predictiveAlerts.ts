/**
 * Predictive Alerts Engine
 * Detects hypoglycemia/hyperglycemia risks and glucose patterns
 */

import { indianFoods } from '../data/indianFoods';

export interface GlucoseReading {
  value: number;
  timestamp: Date;
  mealContext?: 'fasting' | 'before_meal' | 'after_meal' | 'bedtime';
}

export interface Alert {
  id: string;
  type: 'hypoglycemia' | 'hyperglycemia' | 'pattern' | 'medication' | 'lifestyle';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  action?: string;
  acknowledged: boolean;
}

export interface Pattern {
  type: 'dawn_phenomenon' | 'post_meal_spike' | 'nighttime_low' | 'morning_high' | 'afternoon_slump' | 'variable_glucose';
  description: string;
  confidence: number;
  occurrence: number;
  recommendation: string;
  detectedAt: Date;
}

// Hypoglycemia prediction
export function predictHypoglycemia(
  readings: GlucoseReading[],
  currentGlucose: number,
  timeSinceLastMeal: number // in hours
): { risk: 'low' | 'medium' | 'high'; predictedTime?: Date; confidence: number } {
  if (readings.length < 3) {
    return { risk: 'low', confidence: 0.3 };
  }
  
  // Sort by timestamp
  const sortedReadings = [...readings].sort((a, b) => 
    a.timestamp.getTime() - b.timestamp.getTime()
  );
  
  // Calculate trend
  const recentReadings = sortedReadings.slice(-5);
  const trend = calculateTrend(recentReadings);
  
  // Factors that increase hypoglycemia risk
  let riskScore = 0;
  
  // Factor 1: Current glucose level
  if (currentGlucose < 80) riskScore += 40;
  else if (currentGlucose < 100) riskScore += 20;
  
  // Factor 2: Downward trend
  if (trend === 'falling') riskScore += 25;
  
  // Factor 3: Time since last meal
  if (timeSinceLastMeal > 4) riskScore += 20;
  else if (timeSinceLastMeal > 3) riskScore += 10;
  
  // Factor 4: Recent hypoglycemic episodes
  const recentLows = recentReadings.filter(r => r.value < 70).length;
  riskScore += recentLows * 15;
  
  // Factor 5: Variability
  const variability = calculateVariability(recentReadings);
  if (variability > 40) riskScore += 15;
  
  // Determine risk level
  let risk: 'low' | 'medium' | 'high';
  if (riskScore >= 60) risk = 'high';
  else if (riskScore >= 35) risk = 'medium';
  else risk = 'low';
  
  // Predict time to hypoglycemia
  let predictedTime: Date | undefined;
  if (risk !== 'low' && trend === 'falling') {
    const rateOfDrop = calculateRateOfChange(recentReadings);
    if (rateOfDrop > 0) {
      const timeTo70 = (currentGlucose - 70) / rateOfDrop;
      if (timeTo70 > 0) {
        predictedTime = new Date(Date.now() + timeTo70 * 60 * 60 * 1000);
      }
    }
  }
  
  const confidence = Math.min(riskScore / 100, 1);
  
  return { risk, predictedTime, confidence };
}

// Hyperglycemia prediction
export function predictHyperglycemia(
  readings: GlucoseReading[],
  currentGlucose: number,
  timeSinceLastMeal: number
): { risk: 'low' | 'medium' | 'high'; predictedPeak?: number; confidence: number } {
  if (readings.length < 3) {
    return { risk: 'low', confidence: 0.3 };
  }
  
  const sortedReadings = [...readings].sort((a, b) => 
    a.timestamp.getTime() - b.timestamp.getTime()
  );
  
  const recentReadings = sortedReadings.slice(-5);
  const trend = calculateTrend(recentReadings);
  
  let riskScore = 0;
  
  // Factor 1: Current glucose level
  if (currentGlucose > 200) riskScore += 40;
  else if (currentGlucose > 160) riskScore += 25;
  else if (currentGlucose > 140) riskScore += 10;
  
  // Factor 2: Upward trend
  if (trend === 'rising') riskScore += 25;
  
  // Factor 3: Time since meal (post-meal spike window)
  if (timeSinceLastMeal > 1 && timeSinceLastMeal < 3) riskScore += 20;
  
  // Factor 4: Recent highs
  const recentHighs = recentReadings.filter(r => r.value > 180).length;
  riskScore += recentHighs * 10;
  
  // Factor 5: Dawn phenomenon risk (morning hours)
  const hour = new Date().getHours();
  if (hour >= 4 && hour <= 8) riskScore += 15;
  
  let risk: 'low' | 'medium' | 'high';
  if (riskScore >= 60) risk = 'high';
  else if (riskScore >= 35) risk = 'medium';
  else risk = 'low';
  
  // Predict peak glucose
  let predictedPeak: number | undefined;
  if (trend === 'rising') {
    const rateOfRise = calculateRateOfChange(recentReadings);
    if (rateOfRise > 0) {
      // Assume peak at 2 hours post-meal
      predictedPeak = currentGlucose + (rateOfRise * 2);
    }
  }
  
  const confidence = Math.min(riskScore / 100, 1);
  
  return { risk, predictedPeak, confidence };
}

// Analyze glucose patterns
export function analyzeGlucosePatterns(readings: GlucoseReading[]): Pattern[] {
  if (readings.length < 10) {
    return [];
  }
  
  const patterns: Pattern[] = [];
  const sortedReadings = [...readings].sort((a, b) => 
    a.timestamp.getTime() - b.timestamp.getTime()
  );
  
  // Pattern 1: Dawn Phenomenon
  const dawnReadings = sortedReadings.filter(r => {
    const hour = r.timestamp.getHours();
    return hour >= 4 && hour <= 8;
  });
  
  if (dawnReadings.length >= 3) {
    const avgDawn = dawnReadings.reduce((sum, r) => sum + r.value, 0) / dawnReadings.length;
    const fastingReadings = sortedReadings.filter(r => r.mealContext === 'fasting');
    const avgFasting = fastingReadings.length > 0
      ? fastingReadings.reduce((sum, r) => sum + r.value, 0) / fastingReadings.length
      : avgDawn;
    
    if (avgDawn > avgFasting + 20) {
      patterns.push({
        type: 'dawn_phenomenon',
        description: `Morning glucose rises ${Math.round(avgDawn - avgFasting)} mg/dL between 4-8 AM`,
        confidence: Math.min((avgDawn - avgFasting) / 50, 0.95),
        occurrence: dawnReadings.length,
        recommendation: 'Consider taking long-acting insulin at bedtime or discuss medication adjustment with your doctor',
        detectedAt: new Date()
      });
    }
  }
  
  // Pattern 2: Post-Meal Spikes
  const postMealReadings = sortedReadings.filter(r => r.mealContext === 'after_meal');
  if (postMealReadings.length >= 5) {
    const highSpikes = postMealReadings.filter(r => r.value > 180).length;
    const spikeRate = highSpikes / postMealReadings.length;
    
    if (spikeRate > 0.4) {
      patterns.push({
        type: 'post_meal_spike',
        description: `${Math.round(spikeRate * 100)}% of post-meal readings show elevated glucose (>180 mg/dL)`,
        confidence: spikeRate,
        occurrence: highSpikes,
        recommendation: 'Try eating protein and vegetables before carbs, or consider portion control',
        detectedAt: new Date()
      });
    }
  }
  
  // Pattern 3: Nighttime Lows
  const nighttimeReadings = sortedReadings.filter(r => {
    const hour = r.timestamp.getHours();
    return hour >= 22 || hour <= 6;
  });
  
  if (nighttimeReadings.length >= 3) {
    const nighttimeLows = nighttimeReadings.filter(r => r.value < 70).length;
    if (nighttimeLows >= 2) {
      patterns.push({
        type: 'nighttime_low',
        description: `Frequent low glucose (${nighttimeLows} episodes) during night hours`,
        confidence: Math.min(nighttimeLows / 3, 0.9),
        occurrence: nighttimeLows,
        recommendation: 'Consider a small snack before bed or discuss evening medication adjustment with your doctor',
        detectedAt: new Date()
      });
    }
  }
  
  // Pattern 4: Variable Glucose
  const variability = calculateVariability(sortedReadings.slice(-10));
  if (variability > 40) {
    patterns.push({
      type: 'variable_glucose',
      description: `High glucose variability (CV: ${Math.round(variability)}%) indicates unstable control`,
      confidence: Math.min(variability / 100, 0.9),
      occurrence: sortedReadings.length,
      recommendation: 'Focus on consistent meal timing and carbohydrate counting',
      detectedAt: new Date()
    });
  }
  
  // Pattern 5: Afternoon Slump
  const afternoonReadings = sortedReadings.filter(r => {
    const hour = r.timestamp.getHours();
    return hour >= 14 && hour <= 17;
  });
  
  if (afternoonReadings.length >= 3) {
    const lowAfternoon = afternoonReadings.filter(r => r.value < 90).length;
    if (lowAfternoon >= 2) {
      patterns.push({
        type: 'afternoon_slump',
        description: 'Recurring low glucose in afternoon hours (2-5 PM)',
        confidence: Math.min(lowAfternoon / 3, 0.85),
        occurrence: lowAfternoon,
        recommendation: 'Consider a small protein snack in the early afternoon',
        detectedAt: new Date()
      });
    }
  }
  
  return patterns.sort((a, b) => b.confidence - a.confidence);
}

// Generate alerts based on predictions
export function generateAlerts(
  readings: GlucoseReading[],
  currentGlucose: number,
  timeSinceLastMeal: number
): Alert[] {
  const alerts: Alert[] = [];
  const now = new Date();
  
  // Check hypoglycemia risk
  const hypoPrediction = predictHypoglycemia(readings, currentGlucose, timeSinceLastMeal);
  if (hypoPrediction.risk !== 'low') {
    alerts.push({
      id: `hypo-${now.getTime()}`,
      type: 'hypoglycemia',
      severity: hypoPrediction.risk === 'high' ? 'critical' : 'warning',
      title: hypoPrediction.risk === 'high' ? '⚠️ High Hypoglycemia Risk' : '⚡ Hypoglycemia Warning',
      message: hypoPrediction.predictedTime
        ? `Predicted to drop to 70 mg/dL by ${hypoPrediction.predictedTime.toLocaleTimeString()}`
        : `Risk of low glucose in the next few hours (confidence: ${Math.round(hypoPrediction.confidence * 100)}%)`,
      timestamp: now,
      action: 'Have 15g of fast-acting carbs (glucose tablet, juice, or candy) and recheck in 15 minutes',
      acknowledged: false
    });
  }
  
  // Check hyperglycemia risk
  const hyperPrediction = predictHyperglycemia(readings, currentGlucose, timeSinceLastMeal);
  if (hyperPrediction.risk !== 'low') {
    alerts.push({
      id: `hyper-${now.getTime()}`,
      type: 'hyperglycemia',
      severity: hyperPrediction.risk === 'high' ? 'warning' : 'info',
      title: hyperPrediction.risk === 'high' ? '⚠️ Elevated Glucose' : '📊 Glucose Trending High',
      message: hyperPrediction.predictedPeak
        ? `Predicted to peak at ${Math.round(hyperPrediction.predictedPeak)} mg/dL`
        : `Risk of elevated glucose (confidence: ${Math.round(hyperPrediction.confidence * 100)}%)`,
      timestamp: now,
      action: 'Stay hydrated, consider light exercise (15-20 min walk), and monitor closely',
      acknowledged: false
    });
  }
  
  // Add pattern-based alerts
  const patterns = analyzeGlucosePatterns(readings);
  patterns.forEach(pattern => {
    if (pattern.confidence > 0.6) {
      alerts.push({
        id: `pattern-${pattern.type}-${now.getTime()}`,
        type: 'pattern',
        severity: pattern.confidence > 0.8 ? 'warning' : 'info',
        title: `📈 Pattern Detected: ${pattern.type.replace('_', ' ').toUpperCase()}`,
        message: pattern.description,
        timestamp: now,
        action: pattern.recommendation,
        acknowledged: false
      });
    }
  });
  
  return alerts;
}

// Helper functions
function calculateTrend(readings: GlucoseReading[]): 'rising' | 'falling' | 'stable' {
  if (readings.length < 2) return 'stable';
  
  const first = readings[0].value;
  const last = readings[readings.length - 1].value;
  const diff = last - first;
  
  if (diff > 15) return 'rising';
  if (diff < -15) return 'falling';
  return 'stable';
}

function calculateRateOfChange(readings: GlucoseReading[]): number {
  if (readings.length < 2) return 0;
  
  const first = readings[0];
  const last = readings[readings.length - 1];
  const timeDiff = (last.timestamp.getTime() - first.timestamp.getTime()) / (1000 * 60 * 60); // hours
  
  if (timeDiff === 0) return 0;
  
  return (last.value - first.value) / timeDiff;
}

function calculateVariability(readings: GlucoseReading[]): number {
  if (readings.length < 2) return 0;
  
  const values = readings.map(r => r.value);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  const stdDev = Math.sqrt(variance);
  const cv = (stdDev / mean) * 100;
  
  return cv;
}

// Export for use in UI
export {
  calculateTrend,
  calculateRateOfChange,
  calculateVariability
};
