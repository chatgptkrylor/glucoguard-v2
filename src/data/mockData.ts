import { GlucoseReading, HealthStats, Prediction, FoodItem, Alert } from '../types';

export const mockGlucoseData = [
  { time: '12 AM', value: 120 },
  { time: '2 AM', value: 110 },
  { time: '4 AM', value: 105 },
  { time: '6 AM', value: 140 },
  { time: '8 AM', value: 160 },
  { time: '10 AM', value: 145 },
  { time: '12 PM', value: 180 },
  { time: '2 PM', value: 165 },
  { time: '4 PM', value: 150 },
  { time: '6 PM', value: 175 },
  { time: '8 PM', value: 155 },
  { time: '10 PM', value: 130 },
];

export const mockHealthStats: HealthStats = {
  timeInRange: 65,
  averageGlucose: 148,
  glucoseVariability: 28,
  estimatedHbA1c: 7.2,
  totalReadings: 42,
  hypoEvents: 2,
  hyperEvents: 5,
};

export const mockPredictions: Prediction[] = [
  {
    id: '1',
    type: 'hypoglycemia',
    probability: 35,
    timeframe: 'Next 4 hours',
    confidence: 'medium',
    recommendations: [
      'Have a small snack before bedtime',
      'Monitor glucose at 2 AM',
      'Consider reducing evening insulin'
    ]
  },
  {
    id: '2',
    type: 'dawn_phenomenon',
    probability: 78,
    timeframe: 'Tomorrow morning (4-8 AM)',
    confidence: 'high',
    recommendations: [
      'Take long-acting insulin at bedtime',
      'Light morning exercise may help',
      'Avoid late-night snacks'
    ]
  },
  {
    id: '3',
    type: 'hyperglycemia',
    probability: 25,
    timeframe: 'After next meal',
    confidence: 'low',
    recommendations: [
      'Choose low-GI foods for lunch',
      'Take post-meal walk (15-20 min)',
      'Stay hydrated'
    ]
  }
];

export const mockIndianFoods: FoodItem[] = [
  // North Indian
  { id: '1', name: 'Roti (Whole Wheat)', hindiName: 'रोटी', region: 'north', servingSize: '1 medium', carbs: 15, protein: 3, fat: 0.5, fiber: 2, calories: 80, glycemicIndex: 62, glycemicLoad: 'medium', category: 'grain' },
  { id: '2', name: 'Chapati (Multigrain)', hindiName: 'चपाती', region: 'north', servingSize: '1 medium', carbs: 18, protein: 4, fat: 1, fiber: 3, calories: 95, glycemicIndex: 52, glycemicLoad: 'low', category: 'grain' },
  { id: '3', name: 'Dal Makhani', hindiName: 'दाल मखानी', region: 'north', servingSize: '1 cup', carbs: 25, protein: 12, fat: 8, fiber: 8, calories: 220, glycemicIndex: 35, glycemicLoad: 'low', category: 'pulse' },
  { id: '4', name: 'Palak Paneer', hindiName: 'पालक पनीर', region: 'north', servingSize: '1 cup', carbs: 8, protein: 14, fat: 15, fiber: 3, calories: 220, glycemicIndex: 15, glycemicLoad: 'low', category: 'dairy' },
  { id: '5', name: 'Chole (Chickpea Curry)', hindiName: 'छोले', region: 'north', servingSize: '1 cup', carbs: 35, protein: 12, fat: 8, fiber: 10, calories: 270, glycemicIndex: 28, glycemicLoad: 'low', category: 'pulse' },
  { id: '6', name: 'Rice (Basmati)', hindiName: 'चावल', region: 'north', servingSize: '1 cup cooked', carbs: 45, protein: 4, fat: 0.5, fiber: 1, calories: 205, glycemicIndex: 58, glycemicLoad: 'medium', category: 'grain' },
  { id: '7', name: 'Raita', hindiName: 'रायता', region: 'north', servingSize: '1 cup', carbs: 8, protein: 6, fat: 4, fiber: 0, calories: 90, glycemicIndex: 25, glycemicLoad: 'low', category: 'dairy' },
  { id: '8', name: 'Tandoori Chicken', hindiName: 'तंदूरी चिकन', region: 'north', servingSize: '100g', carbs: 2, protein: 28, fat: 8, fiber: 0, calories: 195, glycemicIndex: 0, glycemicLoad: 'low', category: 'meat' },
  
  // South Indian
  { id: '9', name: 'Idli', hindiName: 'इडली', region: 'south', servingSize: '2 pieces', carbs: 25, protein: 5, fat: 0.5, fiber: 2, calories: 130, glycemicIndex: 60, glycemicLoad: 'medium', category: 'grain' },
  { id: '10', name: 'Dosa (Plain)', hindiName: 'डोसा', region: 'south', servingSize: '1 medium', carbs: 20, protein: 3, fat: 5, fiber: 1, calories: 135, glycemicIndex: 66, glycemicLoad: 'medium', category: 'grain' },
  { id: '11', name: 'Sambar', hindiName: 'सांभर', region: 'south', servingSize: '1 cup', carbs: 18, protein: 6, fat: 3, fiber: 5, calories: 120, glycemicIndex: 35, glycemicLoad: 'low', category: 'pulse' },
  { id: '12', name: 'Rasam', hindiName: 'रसम', region: 'south', servingSize: '1 cup', carbs: 8, protein: 2, fat: 2, fiber: 2, calories: 60, glycemicIndex: 20, glycemicLoad: 'low', category: 'pulse' },
  { id: '13', name: 'Appam', hindiName: 'अप्पम', region: 'south', servingSize: '2 pieces', carbs: 30, protein: 3, fat: 4, fiber: 1, calories: 170, glycemicIndex: 55, glycemicLoad: 'medium', category: 'grain' },
  { id: '14', name: 'Pongal', hindiName: 'पोंगल', region: 'south', servingSize: '1 cup', carbs: 40, protein: 6, fat: 8, fiber: 2, calories: 260, glycemicIndex: 65, glycemicLoad: 'medium', category: 'grain' },
  { id: '15', name: 'Coconut Chutney', hindiName: 'नारियल चटनी', region: 'south', servingSize: '2 tbsp', carbs: 4, protein: 1, fat: 8, fiber: 2, calories: 90, glycemicIndex: 20, glycemicLoad: 'low', category: 'dairy' },
  
  // East Indian
  { id: '16', name: 'Fish Curry', hindiName: 'मछली करी', region: 'east', servingSize: '150g', carbs: 5, protein: 25, fat: 10, fiber: 1, calories: 210, glycemicIndex: 0, glycemicLoad: 'low', category: 'meat' },
  { id: '17', name: 'Rice (Govindobhog)', hindiName: 'गोविंदभोग चावल', region: 'east', servingSize: '1 cup', carbs: 40, protein: 4, fat: 0.5, fiber: 1, calories: 180, glycemicIndex: 50, glycemicLoad: 'low', category: 'grain' },
  { id: '18', name: 'Aloo Posto', hindiName: 'आलू पोस्तो', region: 'east', servingSize: '1 cup', carbs: 20, protein: 3, fat: 12, fiber: 3, calories: 200, glycemicIndex: 65, glycemicLoad: 'medium', category: 'vegetable' },
  { id: '19', name: 'Chingri Malai Curry', hindiName: 'चिंगड़ी मलाई करी', region: 'east', servingSize: '1 cup', carbs: 6, protein: 20, fat: 18, fiber: 1, calories: 260, glycemicIndex: 15, glycemicLoad: 'low', category: 'meat' },
  { id: '20', name: 'Macher Jhol', hindiName: 'माछेर झोल', region: 'east', servingSize: '1 cup', carbs: 8, protein: 18, fat: 8, fiber: 2, calories: 170, glycemicIndex: 20, glycemicLoad: 'low', category: 'meat' },
  
  // West Indian
  { id: '21', name: 'Dhokla', hindiName: 'ढोकला', region: 'west', servingSize: '2 pieces', carbs: 20, protein: 6, fat: 4, fiber: 3, calories: 140, glycemicIndex: 45, glycemicLoad: 'low', category: 'grain' },
  { id: '22', name: 'Thepla', hindiName: 'थेपला', region: 'west', servingSize: '2 pieces', carbs: 25, protein: 5, fat: 8, fiber: 4, calories: 200, glycemicIndex: 48, glycemicLoad: 'low', category: 'grain' },
  { id: '23', name: 'Undhiyu', hindiName: 'उंधियू', region: 'west', servingSize: '1 cup', carbs: 30, protein: 8, fat: 12, fiber: 8, calories: 280, glycemicIndex: 40, glycemicLoad: 'low', category: 'vegetable' },
  { id: '24', name: 'Gujarati Kadhi', hindiName: 'कढ़ी', region: 'west', servingSize: '1 cup', carbs: 12, protein: 6, fat: 6, fiber: 1, calories: 120, glycemicIndex: 30, glycemicLoad: 'low', category: 'dairy' },
  { id: '25', name: 'Sev Tamatar', hindiName: 'सेव टमाटर', region: 'west', servingSize: '1 cup', carbs: 18, protein: 4, fat: 10, fiber: 3, calories: 180, glycemicIndex: 45, glycemicLoad: 'low', category: 'vegetable' },
  
  // Pan-India
  { id: '26', name: 'Khichdi', hindiName: 'खिचड़ी', region: 'pan-india', servingSize: '1 cup', carbs: 35, protein: 8, fat: 5, fiber: 4, calories: 220, glycemicIndex: 50, glycemicLoad: 'low', category: 'grain' },
  { id: '27', name: 'Poha', hindiName: 'पोहा', region: 'pan-india', servingSize: '1 cup', carbs: 30, protein: 4, fat: 6, fiber: 2, calories: 190, glycemicIndex: 65, glycemicLoad: 'medium', category: 'grain' },
  { id: '28', name: 'Upma', hindiName: 'उपमा', region: 'pan-india', servingSize: '1 cup', carbs: 32, protein: 6, fat: 8, fiber: 3, calories: 220, glycemicIndex: 62, glycemicLoad: 'medium', category: 'grain' },
  { id: '29', name: 'Sprouts Salad', hindiName: 'अंकुरित सलाद', region: 'pan-india', servingSize: '1 cup', carbs: 15, protein: 10, fat: 2, fiber: 6, calories: 120, glycemicIndex: 25, glycemicLoad: 'low', category: 'pulse' },
  { id: '30', name: 'Mixed Vegetable Sabzi', hindiName: 'मिश्रित सब्जी', region: 'pan-india', servingSize: '1 cup', carbs: 12, protein: 3, fat: 5, fiber: 5, calories: 110, glycemicIndex: 35, glycemicLoad: 'low', category: 'vegetable' },
  { id: '31', name: 'Curd/Yogurt', hindiName: 'दही', region: 'pan-india', servingSize: '1 cup', carbs: 12, protein: 10, fat: 8, fiber: 0, calories: 150, glycemicIndex: 35, glycemicLoad: 'low', category: 'dairy' },
  { id: '32', name: 'Paneer Tikka', hindiName: 'पनीर टिक्का', region: 'pan-india', servingSize: '100g', carbs: 4, protein: 18, fat: 20, fiber: 1, calories: 260, glycemicIndex: 15, glycemicLoad: 'low', category: 'dairy' },
  { id: '33', name: 'Tandoori Fish', hindiName: 'तंदूरी मछली', region: 'pan-india', servingSize: '150g', carbs: 3, protein: 32, fat: 10, fiber: 0, calories: 230, glycemicIndex: 0, glycemicLoad: 'low', category: 'meat' },
  { id: '34', name: 'Green Salad', hindiName: 'हरा सलाद', region: 'pan-india', servingSize: '1 bowl', carbs: 8, protein: 2, fat: 2, fiber: 4, calories: 60, glycemicIndex: 15, glycemicLoad: 'low', category: 'vegetable' },
  { id: '35', name: 'Cucumber Raita', hindiName: 'खीरा रायता', region: 'pan-india', servingSize: '1 cup', carbs: 6, protein: 5, fat: 4, fiber: 1, calories: 80, glycemicIndex: 20, glycemicLoad: 'low', category: 'dairy' },
  { id: '36', name: 'Lentil Soup (Dal)', hindiName: 'दाल', region: 'pan-india', servingSize: '1 cup', carbs: 20, protein: 10, fat: 4, fiber: 6, calories: 160, glycemicIndex: 30, glycemicLoad: 'low', category: 'pulse' },
  { id: '37', name: 'Grilled Chicken', hindiName: 'ग्रिल्ड चिकन', region: 'pan-india', servingSize: '150g', carbs: 0, protein: 40, fat: 12, fiber: 0, calories: 280, glycemicIndex: 0, glycemicLoad: 'low', category: 'meat' },
  { id: '38', name: 'Egg Bhurji', hindiName: 'अंडा भुर्जी', region: 'pan-india', servingSize: '2 eggs', carbs: 4, protein: 14, fat: 16, fiber: 1, calories: 210, glycemicIndex: 0, glycemicLoad: 'low', category: 'meat' },
  { id: '39', name: 'Masala Chai', hindiName: 'मसाला चाय', region: 'pan-india', servingSize: '1 cup', carbs: 8, protein: 2, fat: 4, fiber: 0, calories: 80, glycemicIndex: 40, glycemicLoad: 'low', category: 'beverage' },
  { id: '40', name: 'Buttermilk (Chaas)', hindiName: 'छाछ', region: 'pan-india', servingSize: '1 cup', carbs: 5, protein: 4, fat: 2, fiber: 0, calories: 50, glycemicIndex: 20, glycemicLoad: 'low', category: 'beverage' },
];

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'hypoglycemia',
    severity: 'high',
    title: 'Low Glucose Alert',
    message: 'Your glucose dropped to 65 mg/dL at 3:30 AM',
    timestamp: new Date('2026-03-19T03:30:00'),
    action: 'Have 15g fast carbs immediately',
    acknowledged: false
  },
  {
    id: '2',
    type: 'pattern',
    severity: 'medium',
    title: 'Dawn Phenomenon Detected',
    message: 'Consistent morning glucose spikes detected',
    timestamp: new Date('2026-03-19T07:00:00'),
    action: 'Consider adjusting bedtime medication',
    acknowledged: false
  },
  {
    id: '3',
    type: 'lifestyle',
    severity: 'low',
    title: 'Exercise Reminder',
    message: 'You haven\'t logged exercise in 2 days',
    timestamp: new Date('2026-03-19T10:00:00'),
    action: 'A 15-min walk can improve glucose control',
    acknowledged: true
  }
];
