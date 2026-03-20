/**
 * GlucoGuard API Interfaces
 * Use these types in the UI to connect to the backend
 * 
 * Nancy: Import these interfaces into your React/Vue components
 */

// =============================================================================
// USER PROFILE
// =============================================================================

export interface UserProfile {
  name: string;
  age: number;
  diabetesType: 'Type1' | 'Type2' | 'Gestational' | 'Pre-diabetes';
  targetGlucoseRange: { min: number; max: number };
  medications: Medication[];
  allergies: string[];
  foodPreferences: {
    vegetarian: boolean;
    avoidFoods: string[];
    preferredCuisines: string[];
  };
}

export interface Medication {
  name: string;
  dose: string;
  timing: string[];
}

// =============================================================================
// GLUCOSE DATA
// =============================================================================

export interface GlucoseReading {
  value: number;
  timestamp: Date;
  mealContext?: 'before_meal' | 'after_meal' | 'fasting' | 'bedtime';
}

export interface GlucoseAnalysis {
  current: number;
  trend: 'rising' | 'falling' | 'stable';
  prediction: number;
  risk: 'low' | 'medium' | 'high';
  timeInRange: {
    percentage: number;
    low: number;
    inRange: number;
    high: number;
  };
  estimatedHbA1c: number;
  variability: number;
}

// =============================================================================
// MEAL RECOMMENDATIONS
// =============================================================================

export interface MealOption {
  id: string;
  name: string;
  hindiName?: string;
  description: string;
  glycemicLoad: number;
  predictedGlucoseChange: number;
  tags: string[];
  carbs: number;
  protein: number;
  calories: number;
}

export interface MealPlan {
  options: MealOption[];
  predictedImpact: { [foodId: string]: number };
  warnings: string[];
}

// =============================================================================
// ALERTS
// =============================================================================

export interface Alert {
  type: 'hypoglycemia' | 'hyperglycemia' | 'pattern' | 'medication';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: Date;
  action?: string;
}

// =============================================================================
// PATTERNS
// =============================================================================

export interface Pattern {
  type: string;
  description: string;
  confidence: number;
  recommendation: string;
}

// =============================================================================
// CHATBOT
// =============================================================================

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  language: 'en' | 'hi';
}

// =============================================================================
// API RESPONSES
// =============================================================================

export interface GlucoGuardResponse {
  glucose: GlucoseAnalysis;
  mealRecommendations?: MealPlan;
  alerts: Alert[];
  patterns: Pattern[];
}

export interface ChatResponse extends GlucoGuardResponse {
  chatbot: {
    response: string;
    language: 'en' | 'hi';
  };
}

// =============================================================================
// MOCK DATA FOR UI DEVELOPMENT
// =============================================================================

export const mockUserProfile: UserProfile = {
  name: 'Rajesh Kumar',
  age: 45,
  diabetesType: 'Type2',
  targetGlucoseRange: { min: 80, max: 140 },
  medications: [
    { name: 'Metformin', dose: '500mg', timing: ['morning', 'evening'] }
  ],
  allergies: [],
  foodPreferences: {
    vegetarian: true,
    avoidFoods: ['paneer', 'cashew'],
    preferredCuisines: ['North Indian', 'South Indian']
  }
};

export const mockGlucoseReadings: GlucoseReading[] = [
  { value: 120, timestamp: new Date('2026-03-19T08:00:00'), mealContext: 'fasting' },
  { value: 145, timestamp: new Date('2026-03-19T10:30:00'), mealContext: 'after_meal' },
  { value: 130, timestamp: new Date('2026-03-19T13:00:00'), mealContext: 'before_meal' },
  { value: 160, timestamp: new Date('2026-03-19T14:30:00'), mealContext: 'after_meal' },
  { value: 125, timestamp: new Date('2026-03-19T18:00:00'), mealContext: 'before_meal' },
  { value: 150, timestamp: new Date('2026-03-19T20:00:00'), mealContext: 'after_meal' },
];

export const mockGlucoseAnalysis: GlucoseAnalysis = {
  current: 142,
  trend: 'stable',
  prediction: 138,
  risk: 'medium',
  timeInRange: {
    percentage: 65,
    low: 15,
    inRange: 65,
    high: 20
  },
  estimatedHbA1c: 7.2,
  variability: 28
};

export const mockMealOptions: MealOption[] = [
  {
    id: '1',
    name: 'Dal Khichdi',
    hindiName: 'दाल खिचड़ी',
    description: 'Rice and lentils cooked together with mild spices',
    glycemicLoad: 15,
    predictedGlucoseChange: 25,
    tags: ['vegetarian', 'easy-to-digest', 'north-indian'],
    carbs: 35,
    protein: 8,
    calories: 220
  },
  {
    id: '2',
    name: 'Palak Paneer',
    hindiName: 'पालक पनीर',
    description: 'Spinach curry with cottage cheese',
    glycemicLoad: 8,
    predictedGlucoseChange: 12,
    tags: ['vegetarian', 'protein-rich', 'north-indian'],
    carbs: 8,
    protein: 14,
    calories: 220
  },
  {
    id: '3',
    name: 'Idli with Sambar',
    hindiName: 'इडली सांभर',
    description: 'Steamed rice cakes with lentil soup',
    glycemicLoad: 18,
    predictedGlucoseChange: 30,
    tags: ['vegetarian', 'south-indian', 'fermented'],
    carbs: 25,
    protein: 5,
    calories: 130
  }
];

export const mockAlerts: Alert[] = [
  {
    type: 'hypoglycemia',
    severity: 'critical',
    message: 'Risk of low glucose in next 2 hours',
    timestamp: new Date(),
    action: 'Have a small snack (15g carbs)'
  },
  {
    type: 'pattern',
    severity: 'warning',
    message: 'Dawn phenomenon detected - morning spikes',
    timestamp: new Date(),
    action: 'Consider adjusting evening medication'
  },
  {
    type: 'medication',
    severity: 'info',
    message: 'Take Metformin 500mg',
    timestamp: new Date()
  }
];

export const mockPatterns: Pattern[] = [
  {
    type: 'dawn_phenomenon',
    description: 'Morning glucose spikes between 4-8 AM',
    confidence: 0.85,
    recommendation: 'Take long-acting insulin at bedtime'
  },
  {
    type: 'post_meal_spike',
    description: 'High glucose after lunch',
    confidence: 0.72,
    recommendation: 'Reduce lunch portion or add post-meal walk'
  }
];

// =============================================================================
// API FUNCTIONS (MOCK - Replace with real calls to Sushram's backend)
// =============================================================================

export async function getGlucoseAnalysis(): Promise<GlucoseAnalysis> {
  // TODO: Replace with call to Sushram's glucoseAnalysis.ts
  return mockGlucoseAnalysis;
}

export async function getMealRecommendations(
  currentGlucose: number,
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
): Promise<MealPlan> {
  // TODO: Replace with call to Sushram's dietEngine.ts
  return {
    options: mockMealOptions,
    predictedImpact: {
      '1': currentGlucose + 25,
      '2': currentGlucose + 12,
      '3': currentGlucose + 30
    },
    warnings: currentGlucose > 180 ? ['High glucose - choose low GI foods'] : []
  };
}

export async function getAlerts(): Promise<Alert[]> {
  // TODO: Replace with call to Sushram's predictiveAlerts.ts
  return mockAlerts;
}

export async function getPatterns(): Promise<Pattern[]> {
  // TODO: Replace with call to Sushram's pattern detection
  return mockPatterns;
}

export async function sendMessage(
  message: string,
  language: 'en' | 'hi' = 'en'
): Promise<ChatResponse> {
  // TODO: Replace with call to Bunty's LLM orchestrator
  const mockResponse: ChatResponse = {
    glucose: mockGlucoseAnalysis,
    mealRecommendations: {
      options: mockMealOptions.slice(0, 2),
      predictedImpact: {},
      warnings: []
    },
    alerts: mockAlerts,
    patterns: mockPatterns,
    chatbot: {
      response: language === 'hi' 
        ? 'आपका ग्लूकोज स्तर 142 mg/dL है। यह थोड़ा अधिक है। कृपया एक छोटी सी टहलने जाएं।'
        : 'Your glucose level is 142 mg/dL, which is slightly elevated. Consider a short walk.',
      language
    }
  };
  return mockResponse;
}
