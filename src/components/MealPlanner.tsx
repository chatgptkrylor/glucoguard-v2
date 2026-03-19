import React, { useState } from 'react';
import { Utensils, Clock, Flame, Leaf, ChevronRight, Info, AlertCircle } from 'lucide-react';
import { mockIndianFoods } from '../data/mockData';

const MealPlanner: React.FC = () => {
  const [currentGlucose, setCurrentGlucose] = useState('');
  const [targetGlucose, setTargetGlucose] = useState('140');
  const [mealType, setMealType] = useState('lunch');
  const [region, setRegion] = useState('north');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const generateRecommendations = () => {
    const current = parseInt(currentGlucose) || 140;
    const foods = mockIndianFoods;
    
    // Filter by region and GI based on current glucose
    let filtered = foods.filter(f => region === 'any' || f.region === region || f.region === 'pan-india');
    
    if (current > 180) {
      // High glucose - recommend low GI foods
      filtered = filtered.filter(f => f.glycemicLoad === 'low');
    } else if (current < 100) {
      // Low glucose - include medium GI
      filtered = filtered.filter(f => f.glycemicLoad !== 'high');
    }
    
    // Create meal combinations
    const grains = filtered.filter(f => f.category === 'grain').slice(0, 2);
    const pulses = filtered.filter(f => f.category === 'pulse').slice(0, 2);
    const vegetables = filtered.filter(f => f.category === 'vegetable').slice(0, 2);
    const proteins = filtered.filter(f => f.category === 'meat' || f.category === 'dairy').slice(0, 2);
    
    const meals = [
      {
        name: 'Balanced Plate',
        foods: [grains[0], pulses[0], vegetables[0], proteins[0]].filter(Boolean),
        totalCarbs: 0,
        totalProtein: 0,
        totalCalories: 0,
        glycemicLoad: 'low'
      },
      {
        name: 'Protein Rich',
        foods: [grains[1], pulses[1], proteins[1], vegetables[1]].filter(Boolean),
        totalCarbs: 0,
        totalProtein: 0,
        totalCalories: 0,
        glycemicLoad: 'low'
      }
    ];
    
    meals.forEach(meal => {
      meal.totalCarbs = meal.foods.reduce((sum, f) => sum + f.carbs, 0);
      meal.totalProtein = meal.foods.reduce((sum, f) => sum + f.protein, 0);
      meal.totalCalories = meal.foods.reduce((sum, f) => sum + f.calories, 0);
    });
    
    setRecommendations(meals);
    setShowResults(true);
  };

  return (
    <div className="space-y-6">
      {/* Input Panel */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <Utensils className="text-emerald-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Meal Planner</h3>
            <p className="text-slate-400 text-sm">Get personalized Indian meal recommendations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Current Glucose (mg/dL)</label>
            <input
              type="number"
              value={currentGlucose}
              onChange={(e) => setCurrentGlucose(e.target.value)}
              placeholder="e.g., 145"
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Target Glucose</label>
            <input
              type="number"
              value={targetGlucose}
              onChange={(e) => setTargetGlucose(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Meal Type</label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Cuisine Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
            >
              <option value="north">North Indian</option>
              <option value="south">South Indian</option>
              <option value="east">East Indian</option>
              <option value="west">West Indian</option>
              <option value="any">Any Region</option>
            </select>
          </div>
        </div>

        <button
          onClick={generateRecommendations}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all flex items-center justify-center gap-2"
        >
          Generate AI Meal Plan
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Recommendations */}
      {showResults && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map((meal, idx) => (
            <div key={idx} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-white">{meal.name}</h4>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  {meal.glycemicLoad.toUpperCase()} GI
                </span>
              </div>

              <div className="space-y-3 mb-6">
                {meal.foods.map((food: any, fidx: number) => (
                  <div key={fidx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        food.glycemicLoad === 'low' ? 'bg-green-400' : 
                        food.glycemicLoad === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                      }`} />
                      <div>
                        <p className="text-white font-medium">{food.name}</p>
                        <p className="text-slate-400 text-sm">{food.hindiName} • {food.servingSize}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-cyan-400 font-medium">{food.carbs}g carbs</p>
                      <p className="text-slate-500 text-sm">GI: {food.glycemicIndex}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-700">
                <div className="text-center">
                  <Flame size={20} className="text-orange-400 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-white">{meal.totalCalories}</p>
                  <p className="text-slate-400 text-sm">Calories</p>
                </div>
                <div className="text-center">
                  <Leaf size={20} className="text-emerald-400 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-white">{meal.totalCarbs}g</p>
                  <p className="text-slate-400 text-sm">Carbs</p>
                </div>
                <div className="text-center">
                  <Clock size={20} className="text-cyan-400 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-white">{meal.totalProtein}g</p>
                  <p className="text-slate-400 text-sm">Protein</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips Card */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/20">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
            <Info className="text-blue-400" size={24} />
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">AI Meal Planning Tips</h4>
            <ul className="space-y-2 text-slate-300">
              <li>• Choose low glycemic foods (GI < 55) for better glucose control</li>
              <li>• Pair carbs with protein and healthy fats to slow absorption</li>
              <li>• Eat vegetables first, then protein, then carbs</li>
              <li>• Monitor portion sizes - even healthy foods affect glucose</li>
              <li>• Take a 15-minute walk after meals to improve glucose response</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;
