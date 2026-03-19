export interface GlucoseReading {
  id: string;
  value: number;
  timestamp: Date;
  type: 'fasting' | 'pre-meal' | 'post-meal' | 'random';
  notes?: string;
}

export interface MealPlan {
  id: string;
  name: string;
  region: 'north' | 'south' | 'east' | 'west' | 'pan-india';
  glycemicLoad: 'low' | 'medium' | 'high';
  glycemicIndex: number;
  carbs: number;
  calories: number;
  fiber: number;
  protein: number;
  foods: FoodItem[];
  suitableFor: string[];
  image?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  hindiName?: string;
  region: 'north' | 'south' | 'east' | 'west' | 'pan-india';
  servingSize: string;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  calories: number;
  glycemicIndex: number;
  glycemicLoad: 'low' | 'medium' | 'high';
  category: 'grain' | 'pulse' | 'vegetable' | 'fruit' | 'dairy' | 'meat' | 'snack' | 'beverage';
}

export interface Alert {
  id: string;
  type: 'hypoglycemia' | 'hyperglycemia' | 'pattern' | 'medication' | 'lifestyle';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  action?: string;
  acknowledged: boolean;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  diabetesType: 'type1' | 'type2' | 'prediabetic';
  diagnosisDate: Date;
  targetRange: { min: number; max: number };
  medications: string[];
  allergies: string[];
  preferences: {
    region: 'north' | 'south' | 'east' | 'west' | 'any';
    dietType: 'vegetarian' | 'non-vegetarian' | 'vegan';
  };
}

export interface HealthStats {
  timeInRange: number;
  averageGlucose: number;
  glucoseVariability: number;
  estimatedHbA1c: number;
  totalReadings: number;
  hypoEvents: number;
  hyperEvents: number;
}

export interface Prediction {
  type: 'hypoglycemia' | 'hyperglycemia' | 'dawn_phenomenon';
  probability: number;
  timeframe: string;
  confidence: 'low' | 'medium' | 'high';
  recommendations: string[];
}
