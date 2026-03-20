<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  ChefHat, 
  Search, 
  Filter, 
  Plus, 
  Minus,
  Info,
  AlertTriangle,
  CheckCircle2,
  Leaf,
  Flame,
  Droplets,
  Wheat
} from 'lucide-vue-next'
import { indianFoods, FoodItem } from '../data/indianFoods'
import { getMealRecommendations, generateDailyPlan, MealPlan } from '../ai/dietEngine'

const currentGlucose = ref(140)
const targetGlucose = ref(100)
const selectedMealType = ref<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast')
const selectedRegion = ref<'north' | 'south' | 'east' | 'west' | 'any'>('any')
const showDailyPlan = ref(false)

const mealRecommendations = computed(() => {
  return getMealRecommendations({
    currentGlucose: currentGlucose.value,
    targetGlucose: targetGlucose.value,
    mealType: selectedMealType.value,
    region: selectedRegion.value
  })
})

const dailyPlan = computed(() => {
  return generateDailyPlan(currentGlucose.value, targetGlucose.value)
})

const selectedMeal = ref<MealPlan | null>(null)

function getGlycemicLoadColor(load: string): string {
  switch (load) {
    case 'low': return 'text-emerald-400 bg-emerald-400/10'
    case 'medium': return 'text-yellow-400 bg-yellow-400/10'
    case 'high': return 'text-red-400 bg-red-400/10'
    default: return 'text-slate-400 bg-slate-400/10'
  }
}

function getSeverityIcon(severity: string) {
  switch (severity) {
    case 'critical': return AlertTriangle
    case 'warning': return Info
    default: return CheckCircle2
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header & Controls -->
    <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
          <ChefHat class="text-white" :size="24" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-white">AI Meal Planner</h2>
          <p class="text-slate-400">Personalized meal recommendations based on your glucose levels</p>
        </div>
      </div>

      <!-- Controls -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Current Glucose (mg/dL)</label>
          <div class="flex items-center gap-2">
            <button @click="currentGlucose = Math.max(70, currentGlucose - 10)" class="p-2 bg-slate-700 rounded-lg hover:bg-slate-600">
              <Minus :size="16" />
            </button>
            <input 
              v-model.number="currentGlucose" 
              type="number" 
              class="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-center text-white font-semibold"
            />
            <button @click="currentGlucose = Math.min(400, currentGlucose + 10)" class="p-2 bg-slate-700 rounded-lg hover:bg-slate-600">
              <Plus :size="16" />
            </button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Target Glucose (mg/dL)</label>
          <input 
            v-model.number="targetGlucose" 
            type="number" 
            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-center text-white font-semibold"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Meal Type</label>
          <select 
            v-model="selectedMealType" 
            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white capitalize"
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-300 mb-2">Region</label>
          <select 
            v-model="selectedRegion" 
            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white capitalize"
          >
            <option value="any">Any Region</option>
            <option value="north">North Indian</option>
            <option value="south">South Indian</option>
            <option value="east">East Indian</option>
            <option value="west">West Indian</option>
          </select>
        </div>
      </div>

      <!-- Toggle Daily Plan -->
      <div class="mt-6 flex gap-4">
        <button 
          @click="showDailyPlan = !showDailyPlan"
          class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-semibold text-white hover:from-cyan-400 hover:to-blue-400 transition-all"
        >
          {{ showDailyPlan ? 'Hide' : 'Show' }} Full Day Plan
        </button>
      </div>
    </div>

    <!-- Daily Plan Summary -->
    <div v-if="showDailyPlan" class="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <h3 class="text-xl font-bold text-white mb-4">Complete Daily Plan</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-slate-700/50 rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-2xl">🌅</span>
            <span class="font-semibold text-white">Breakfast</span>
          </div>
          <p class="text-sm text-slate-300">{{ dailyPlan.breakfast.name }}</p>
          <div class="mt-2 flex items-center gap-2">
            <span :class="`text-xs px-2 py-1 rounded-full ${getGlycemicLoadColor(dailyPlan.breakfast.glycemicLoad)}`">
              {{ dailyPlan.breakfast.glycemicLoad }} GL
            </span>
          </div>
        </div>

        <div class="bg-slate-700/50 rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-2xl">☀️</span>
            <span class="font-semibold text-white">Lunch</span>
          </div>
          <p class="text-sm text-slate-300">{{ dailyPlan.lunch.name }}</p>
          <div class="mt-2 flex items-center gap-2">
            <span :class="`text-xs px-2 py-1 rounded-full ${getGlycemicLoadColor(dailyPlan.lunch.glycemicLoad)}`">
              {{ dailyPlan.lunch.glycemicLoad }} GL
            </span>
          </div>
        </div>

        <div class="bg-slate-700/50 rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-2xl">🌙</span>
            <span class="font-semibold text-white">Dinner</span>
          </div>
          <p class="text-sm text-slate-300">{{ dailyPlan.dinner.name }}</p>
          <div class="mt-2 flex items-center gap-2">
            <span :class="`text-xs px-2 py-1 rounded-full ${getGlycemicLoadColor(dailyPlan.dinner.glycemicLoad)}`">
              {{ dailyPlan.dinner.glycemicLoad }} GL
            </span>
          </div>
        </div>

        <div class="bg-slate-700/50 rounded-xl p-4">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-2xl">🍎</span>
            <span class="font-semibold text-white">Snacks</span>
          </div>
          <p class="text-sm text-slate-300">{{ dailyPlan.snacks.length }} options</p>
          <div class="mt-2 flex items-center gap-2">
            <span class="text-xs text-slate-400">{{ dailyPlan.totalDailyCarbs }}g carbs/day</span>
          </div>
        </div>
      </div>
      <div class="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
        <p class="text-blue-300 text-sm">{{ dailyPlan.summary }}</p>
      </div>
    </div>

    <!-- Meal Recommendations -->
    <div>
      <h3 class="text-xl font-bold text-white mb-4">Recommended {{ selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1) }} Options</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div 
          v-for="meal in mealRecommendations.slice(0, 6)" 
          :key="meal.id"
          @click="selectedMeal = meal"
          :class="[
            'bg-slate-800 rounded-xl p-5 border cursor-pointer transition-all',
            selectedMeal?.id === meal.id 
              ? 'border-cyan-500 ring-2 ring-cyan-500/20' 
              : 'border-slate-700 hover:border-slate-600'
          ]"
        >
          <div class="flex items-start justify-between mb-3">
            <h4 class="font-semibold text-white">{{ meal.name }}</h4>
            <span :class="`text-xs px-2 py-1 rounded-full font-medium ${getGlycemicLoadColor(meal.glycemicLoad)}`">
              {{ meal.glycemicLoad }} GL
            </span>
          </div>

          <div class="space-y-2 mb-4">
            <div v-for="food in meal.foods.slice(0, 3)" :key="food.id" class="flex items-center gap-2 text-sm text-slate-400">
              <span class="text-slate-500">•</span>
              <span>{{ food.name }}</span>
              <span class="text-xs text-slate-500">({{ food.glycemicIndex }} GI)</span>
            </div>
            <div v-if="meal.foods.length > 3" class="text-xs text-slate-500">
              +{{ meal.foods.length - 3 }} more items
            </div>
          </div>

          <div class="grid grid-cols-4 gap-2 pt-3 border-t border-slate-700">
            <div class="text-center">
              <Flame class="w-4 h-4 text-orange-400 mx-auto mb-1" />
              <span class="text-xs text-slate-400">{{ meal.totalCalories }}</span>
            </div>
            <div class="text-center">
              <Wheat class="w-4 h-4 text-yellow-400 mx-auto mb-1" />
              <span class="text-xs text-slate-400">{{ meal.totalCarbs }}g</span>
            </div>
            <div class="text-center">
              <Leaf class="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span class="text-xs text-slate-400">{{ meal.totalProtein }}g</span>
            </div>
            <div class="text-center">
              <Droplets class="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <span class="text-xs text-slate-400">{{ meal.totalFat }}g</span>
            </div>
          </div>

          <div class="mt-3 text-xs text-cyan-400">
            Predicted glucose: {{ meal.predictedGlucoseChange > 0 ? '+' : '' }}{{ meal.predictedGlucoseChange }} mg/dL
          </div>
        </div>
      </div>
    </div>

    <!-- Selected Meal Detail -->
    <div v-if="selectedMeal" class="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-white">{{ selectedMeal.name }}</h3>
        <button @click="selectedMeal = null" class="text-slate-400 hover:text-white">
          <span class="text-2xl">&times;</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 class="font-semibold text-slate-300 mb-3">Food Items</h4>
          <div class="space-y-2">
            <div v-for="food in selectedMeal.foods" :key="food.id" class="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
              <div>
                <span class="text-white">{{ food.name }}</span>
                <span class="text-xs text-slate-500 ml-2">{{ food.hindiName }}</span>
              </div>
              <div class="text-right text-sm">
                <span class="text-slate-400">{{ food.servingSize }}</span>
                <span class="text-xs text-slate-500 ml-2">{{ food.glycemicIndex }} GI</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 class="font-semibold text-slate-300 mb-3">AI Recommendations</h4>
          <div class="space-y-2">
            <div v-for="(rec, i) in selectedMeal.recommendations" :key="i" class="flex items-start gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <CheckCircle2 class="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span class="text-emerald-300 text-sm">{{ rec }}</span>
            </div>
          </div>

          <div v-if="selectedMeal.warnings.length > 0" class="mt-4">
            <h4 class="font-semibold text-slate-300 mb-3">Warnings</h4>
            <div class="space-y-2">
              <div v-for="(warning, i) in selectedMeal.warnings" :key="i" class="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertTriangle class="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <span class="text-red-300 text-sm">{{ warning }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
