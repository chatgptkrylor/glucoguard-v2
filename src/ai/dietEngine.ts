/**
 * Diet Engine
 * AI-powered meal planning for diabetes management
 */

import { indianFoods, FoodItem } from '../data/indianFoods';

export interface MealRequest {
  currentGlucose: number;
  targetGlucose: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  region?: 'north' | 'south' | 'east' | 'west' | 'any';
  dietaryRestrictions?: string[];
  allergies?: string[];
}

export interface MealPlan {
  id: string;
  name: string;
  foods: FoodItem[];
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
  totalCalories: number;
  averageGI: number;
  predictedGlucoseChange: number;
  glycemicLoad: 'low' | 'medium' | 'high';
  recommendations: string[];
  warnings: string[];
}

export interface DailyPlan {
  breakfast: MealPlan;
  lunch: MealPlan;
  dinner: MealPlan;
  snacks: MealPlan[];
  totalDailyCarbs: number;
  totalDailyCalories: number;
  summary: string;
}

// Calculate glycemic load for a meal
function calculateGlycemicLoad(foods: FoodItem[]): { load: 'low' | 'medium' | 'high'; value: number } {
  if (foods.length === 0) return { load: 'low', value: 0 };
  
  const avgGI = foods.reduce((sum, f) => sum + f.glycemicIndex, 0) / foods.length;
  const totalCarbs = foods.reduce((sum, f) => sum + f.carbs, 0);
  const glycemicLoadValue = (avgGI * totalCarbs) / 100;
  
  if (glycemicLoadValue <= 10) return { load: 'low', value: glycemicLoadValue };
  if (glycemicLoadValue <= 20) return { load: 'medium', value: glycemicLoadValue };
  return { load: 'high', value: glycemicLoadValue };
}

// Predict glucose change based on meal
function predictGlucoseChange(currentGlucose: number, foods: FoodItem[]): number {
  if (foods.length === 0) return 0;
  
  const totalCarbs = foods.reduce((sum, f) => sum + f.carbs, 0);
  const avgGI = foods.reduce((sum, f) => sum + f.glycemicIndex, 0) / foods.length;
  
  // Simplified glucose prediction model
  // Higher carbs + higher GI = bigger glucose spike
  let glucoseChange = (totalCarbs * avgGI) / 100;
  
  // Adjust based on current glucose level
  if (currentGlucose > 180) {
    glucoseChange *= 0.7; // Higher current glucose = less additional spike
  } else if (currentGlucose < 100) {
    glucoseChange *= 1.2; // Lower current glucose = more room to rise
  }
  
  // Protein and fat slow absorption
  const totalProtein = foods.reduce((sum, f) => sum + f.protein, 0);
  const totalFat = foods.reduce((sum, f) => sum + f.fat, 0);
  glucoseChange *= (1 - (totalProtein * 0.005 + totalFat * 0.003));
  
  return Math.round(glucoseChange);
}

// Get meal recommendations based on glucose level
export function getMealRecommendations(request: MealRequest): MealPlan[] {
  const { currentGlucose, mealType, region = 'any', dietaryRestrictions = [], allergies = [] } = request;
  
  // Filter foods by region and restrictions
  let availableFoods = indianFoods.filter(food => {
    // Region filter
    if (region !== 'any' && food.region !== region && food.region !== 'pan-india') {
      return false;
    }
    
    // Allergy filter
    if (allergies.some(allergy => food.name.toLowerCase().includes(allergy.toLowerCase()))) {
      return false;
    }
    
    // Dietary restriction filter
    if (dietaryRestrictions.includes('vegetarian') && food.category === 'meat') {
      return false;
    }
    
    return true;
  });
  
  // Sort by appropriateness for current glucose level
  let prioritizedFoods: FoodItem[];
  
  if (currentGlucose > 180) {
    // High glucose - prioritize low GI foods
    prioritizedFoods = availableFoods.sort((a, b) => a.glycemicIndex - b.glycemicIndex);
  } else if (currentGlucose < 100) {
    // Low glucose - allow medium GI foods for quick recovery
    prioritizedFoods = availableFoods.filter(f => f.glycemicLoad !== 'high');
  } else {
    // Normal glucose - balanced approach
    prioritizedFoods = availableFoods.filter(f => f.glycemicLoad !== 'high');
  }
  
  // Create meal combinations
  const mealPlans: MealPlan[] = [];
  
  // Plan 1: Balanced Plate
  const balancedFoods = [
    prioritizedFoods.find(f => f.category === 'grain'),
    prioritizedFoods.find(f => f.category === 'pulse'),
    prioritizedFoods.find(f => f.category === 'vegetable'),
    prioritizedFoods.find(f => f.category === 'dairy' || f.category === 'meat'),
  ].filter((f): f is FoodItem => f !== undefined);
  
  if (balancedFoods.length >= 3) {
    const giInfo = calculateGlycemicLoad(balancedFoods);
    mealPlans.push({
      id: `balanced-${Date.now()}`,
      name: 'Balanced Plate',
      foods: balancedFoods,
      totalCarbs: balancedFoods.reduce((sum, f) => sum + f.carbs, 0),
      totalProtein: balancedFoods.reduce((sum, f) => sum + f.protein, 0),
      totalFat: balancedFoods.reduce((sum, f) => sum + f.fat, 0),
      totalCalories: balancedFoods.reduce((sum, f) => sum + f.calories, 0),
      averageGI: Math.round(balancedFoods.reduce((sum, f) => sum + f.glycemicIndex, 0) / balancedFoods.length),
      predictedGlucoseChange: predictGlucoseChange(currentGlucose, balancedFoods),
      glycemicLoad: giInfo.load,
      recommendations: [
        'Eat vegetables first to slow glucose absorption',
        'Take a 15-minute walk after this meal',
        'Monitor glucose 2 hours post-meal'
      ],
      warnings: currentGlucose > 180 ? ['Your glucose is elevated. This meal helps stabilize it.'] : []
    });
  }
  
  // Plan 2: Low Carb Option
  const lowCarbFoods = prioritizedFoods
    .filter(f => f.carbs < 15)
    .slice(0, 4);
  
  if (lowCarbFoods.length >= 3) {
    const giInfo = calculateGlycemicLoad(lowCarbFoods);
    mealPlans.push({
      id: `lowcarb-${Date.now()}`,
      name: 'Low Carb Option',
      foods: lowCarbFoods,
      totalCarbs: lowCarbFoods.reduce((sum, f) => sum + f.carbs, 0),
      totalProtein: lowCarbFoods.reduce((sum, f) => sum + f.protein, 0),
      totalFat: lowCarbFoods.reduce((sum, f) => sum + f.fat, 0),
      totalCalories: lowCarbFoods.reduce((sum, f) => sum + f.calories, 0),
      averageGI: Math.round(lowCarbFoods.reduce((sum, f) => sum + f.glycemicIndex, 0) / lowCarbFoods.length),
      predictedGlucoseChange: predictGlucoseChange(currentGlucose, lowCarbFoods),
      glycemicLoad: giInfo.load,
      recommendations: [
        'Excellent choice for glucose control',
        'High protein helps with satiety',
        'Minimal glucose impact expected'
      ],
      warnings: lowCarbFoods.length < 3 ? ['Limited food options available'] : []
    });
  }
  
  // Plan 3: Quick Energy (for low glucose)
  if (currentGlucose < 100) {
    const quickEnergyFoods = availableFoods
      .filter(f => f.glycemicLoad === 'medium' && f.carbs > 15)
      .slice(0, 3);
    
    if (quickEnergyFoods.length >= 2) {
      const giInfo = calculateGlycemicLoad(quickEnergyFoods);
      mealPlans.push({
        id: `quick-${Date.now()}`,
        name: 'Quick Energy Boost',
        foods: quickEnergyFoods,
        totalCarbs: quickEnergyFoods.reduce((sum, f) => sum + f.carbs, 0),
        totalProtein: quickEnergyFoods.reduce((sum, f) => sum + f.protein, 0),
        totalFat: quickEnergyFoods.reduce((sum, f) => sum + f.fat, 0),
        totalCalories: quickEnergyFoods.reduce((sum, f) => sum + f.calories, 0),
        averageGI: Math.round(quickEnergyFoods.reduce((sum, f) => sum + f.glycemicIndex, 0) / quickEnergyFoods.length),
        predictedGlucoseChange: predictGlucoseChange(currentGlucose, quickEnergyFoods),
        glycemicLoad: giInfo.load,
        recommendations: [
          'Helps raise glucose quickly and safely',
          'Follow up with protein for sustained energy',
          'Recheck glucose in 30 minutes'
        ],
        warnings: ['Monitor glucose closely after this meal']
      });
    }
  }
  
  return mealPlans;
}

// Analyze a specific meal for glucose impact
export function analyzeMeal(foods: FoodItem[], currentGlucose: number): {
  predictedGlucose: number;
  timeToPeak: number;
  risk: 'low' | 'medium' | 'high';
  recommendations: string[];
} {
  const glucoseChange = predictGlucoseChange(currentGlucose, foods);
  const predictedGlucose = currentGlucose + glucoseChange;
  
  const avgGI = foods.reduce((sum, f) => sum + f.glycemicIndex, 0) / foods.length;
  const timeToPeak = avgGI < 40 ? 60 : avgGI < 60 ? 90 : 120;
  
  let risk: 'low' | 'medium' | 'high';
  if (predictedGlucose < 180 && predictedGlucose > 80) risk = 'low';
  else if (predictedGlucose < 250 && predictedGlucose > 70) risk = 'medium';
  else risk = 'high';
  
  const recommendations: string[] = [];
  if (avgGI > 55) {
    recommendations.push('Consider adding protein or healthy fat to slow absorption');
  }
  if (predictedGlucose > 180) {
    recommendations.push('Take a 15-20 minute walk after eating');
  }
  recommendations.push(`Monitor glucose at ${timeToPeak} minutes post-meal`);
  
  return {
    predictedGlucose,
    timeToPeak,
    risk,
    recommendations
  };
}

// Generate complete daily meal plan
export function generateDailyPlan(
  avgGlucose: number,
  targetGlucose: number,
  region: 'north' | 'south' | 'east' | 'west' | 'any' = 'any',
  dietaryRestrictions: string[] = []
): DailyPlan {
  const breakfast = getMealRecommendations({
    currentGlucose: avgGlucose,
    targetGlucose,
    mealType: 'breakfast',
    region,
    dietaryRestrictions
  })[0];
  
  const lunch = getMealRecommendations({
    currentGlucose: avgGlucose + 20, // Assume post-breakfast rise
    targetGlucose,
    mealType: 'lunch',
    region,
    dietaryRestrictions
  })[0];
  
  const dinner = getMealRecommendations({
    currentGlucose: avgGlucose + 10,
    targetGlucose,
    mealType: 'dinner',
    region,
    dietaryRestrictions
  })[0];
  
  const snacks = getMealRecommendations({
    currentGlucose: avgGlucose - 10,
    targetGlucose,
    mealType: 'snack',
    region,
    dietaryRestrictions
  });
  
  const totalDailyCarbs = breakfast.totalCarbs + lunch.totalCarbs + dinner.totalCarbs + snacks[0]?.totalCarbs || 0;
  const totalDailyCalories = breakfast.totalCalories + lunch.totalCalories + dinner.totalCalories + snacks[0]?.totalCalories || 0;
  
  return {
    breakfast,
    lunch,
    dinner,
    snacks: snacks.slice(0, 2),
    totalDailyCarbs,
    totalDailyCalories,
    summary: `Daily plan provides ${totalDailyCarbs}g carbs and ${totalDailyCalories} calories. ` +
             `Estimated average glucose: ${avgGlucose} mg/dL. ` +
             `Focus on low-GI foods to maintain stable glucose levels.`
  };
}

// Get foods for specific glucose targets
export function getFoodsForGlucoseLevel(
  currentGlucose: number,
  targetGlucose: number,
  count: number = 5
): FoodItem[] {
  if (currentGlucose > targetGlucose) {
    // Need to lower glucose - recommend low GI foods
    return indianFoods
      .filter(f => f.glycemicLoad === 'low')
      .sort((a, b) => a.glycemicIndex - b.glycemicIndex)
      .slice(0, count);
  } else if (currentGlucose < targetGlucose - 20) {
    // Need to raise glucose - recommend medium GI foods
    return indianFoods
      .filter(f => f.glycemicLoad === 'medium')
      .sort((a, b) => b.glycemicIndex - a.glycemicIndex)
      .slice(0, count);
  } else {
    // Maintain glucose - balanced approach
    return indianFoods
      .filter(f => f.glycemicLoad !== 'high')
      .sort((a, b) => a.carbs - b.carbs)
      .slice(0, count);
  }
}
