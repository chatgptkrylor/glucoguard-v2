<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  ChefHat, 
  Plus, 
  Minus,
  Info,
  AlertTriangle,
  CheckCircle2,
  Leaf,
  Flame,
  Droplets,
  Wheat,
  Loader2,
  X
} from 'lucide-vue-next'
import { getMealRecommendations, generateDailyPlan, MealPlan } from '../ai/dietEngine'

const currentGlucose = ref(140)
const targetGlucose = ref(100)
const selectedMealType = ref<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast')
const selectedRegion = ref<'north' | 'south' | 'east' | 'west' | 'any'>('any')
const showDailyPlan = ref(false)
const isLoading = ref(false)
const selectedMeal = ref<MealPlan | null>(null)

const mealRecommendations = computed(() => {
  return getMealRecommendations({
    currentGlucose: currentGlucose.value,
    targetGlucose: targetGlucose.value,
    mealType: selectedMealType.value,
    region: selectedRegion.value
  })
})

const dailyPlan = computed(() => generateDailyPlan(currentGlucose.value, targetGlucose.value))

function refreshRecommendations() {
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 600)
}

function getGlycemicLoadColor(load: string): string {
  switch (load) {
    case 'low': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
    case 'medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/30'
    case 'high': return 'text-red-400 bg-red-400/10 border-red-400/30'
    default: return 'text-slate-400 bg-slate-400/10'
  }
}

function getGILabel(load: string): string {
  switch (load) {
    case 'low': return 'Low GI'
    case 'medium': return 'Med GI'
    case 'high': return 'High GI'
    default: return load
  }
}
</script>

<template>
  <div class="space-y-4 md:space-y-6">
    <!-- Header & Controls -->
    <div class="bg-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-700">
      <div class="flex items-center gap-3 mb-4 md:mb-6">
        <div class="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
          <ChefHat class="text-white" :size="20" />
        </div>
        <div class="min-w-0">
          <h2 class="text-xl md:text-2xl font-bold text-white truncate">AI Meal Planner</h2>
          <p class="text-slate-400 text-xs md:text-sm truncate">Personalized recommendations based on your glucose</p>
        </div>
      </div>

      <!-- Controls -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <!-- Current Glucose -->
        <div class="col-span-2 md:col-span-1">
          <label class="block text-xs md:text-sm font-medium text-slate-300 mb-1.5 md:mb-2">Current Glucose (mg/dL)</label>
          <div class="flex items-center gap-1.5 md:gap-2">
            <button 
              @click="currentGlucose = Math.max(70, currentGlucose - 10); refreshRecommendations()" 
              class="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 flex-shrink-0 touch-manipulation"
              aria-label="Decrease glucose"
            >
              <Minus :size="16" />
            </button>
            <input 
              v-model.number="currentGlucose" 
              type="number" 
              @change="refreshRecommendations()"
              class="flex-1 min-w-0 bg-slate-700 border border-slate-600 rounded-lg px-2 md:px-4 py-2 text-center text-white font-semibold text-sm md:text-base"
              aria-label="Current glucose value"
            />
            <button 
              @click="currentGlucose = Math.min(400, currentGlucose + 10); refreshRecommendations()" 
              class="p-2 bg-slate-700 rounded-lg hover:bg-slate-600 flex-shrink-0 touch-manipulation"
              aria-label="Increase glucose"
            >
              <Plus :size="16" />
            </button>
          </div>
        </div>

        <!-- Target Glucose -->
        <div>
          <label class="block text-xs md:text-sm font-medium text-slate-300 mb-1.5 md:mb-2">Target (mg/dL)</label>
          <input 
            v-model.number="targetGlucose" 
            type="number" 
            @change="refreshRecommendations()"
            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-2 md:px-4 py-2 text-center text-white font-semibold text-sm md:text-base"
            aria-label="Target glucose value"
          />
        </div>

        <!-- Meal Type -->
        <div>
          <label class="block text-xs md:text-sm font-medium text-slate-300 mb-1.5 md:mb-2">Meal Type</label>
          <select 
            v-model="selectedMealType" 
            @change="refreshRecommendations()"
            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-2 md:px-4 py-2 text-white text-sm md:text-base capitalize"
            aria-label="Select meal type"
          >
            <option value="breakfast">🌅 Breakfast</option>
            <option value="lunch">☀️ Lunch</option>
            <option value="dinner">🌙 Dinner</option>
            <option value="snack">🍎 Snack</option>
          </select>
        </div>

        <!-- Region -->
        <div>
          <label class="block text-xs md:text-sm font-medium text-slate-300 mb-1.5 md:mb-2">Region</label>
          <select 
            v-model="selectedRegion" 
            @change="refreshRecommendations()"
            class="w-full bg-slate-700 border border-slate-600 rounded-lg px-2 md:px-4 py-2 text-white text-sm md:text-base capitalize"
            aria-label="Select cuisine region"
          >
            <option value="any">🌍 Any Region</option>
            <option value="north">🍛 North Indian</option>
            <option value="south">🥥 South Indian</option>
            <option value="east">🐟 East Indian</option>
            <option value="west">🌶️ West Indian</option>
          </select>
        </div>
      </div>

      <!-- Toggle Daily Plan -->
      <div class="mt-4 md:mt-6">
        <button 
          @click="showDailyPlan = !showDailyPlan"
          class="w-full md:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg md:rounded-xl font-semibold text-white text-sm md:text-base hover:from-cyan-400 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/25"
          aria-label="Toggle daily meal plan"
        >
          {{ showDailyPlan ? '🔽 Hide' : '🔼 Show' }} Full Day Plan
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <Loader2 class="w-10 h-10 md:w-12 md:h-12 text-orange-400 animate-spin mx-auto mb-4" />
        <p class="text-slate-300 text-sm md:text-base">AI is analyzing your glucose...</p>
        <p class="text-slate-500 text-xs md:text-sm mt-2">Finding optimal meals</p>
      </div>
    </div>

    <div v-else class="space-y-4 md:space-y-6">
      <!-- Daily Plan Summary -->
      <div v-if="showDailyPlan" class="bg-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-700 animate-in fade-in">
        <h3 class="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Complete Daily Plan</h3>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <!-- Breakfast -->
          <div class="bg-slate-700/50 rounded-lg md:rounded-xl p-3 md:p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-lg md:text-xl">🌅</span>
              <span class="font-semibold text-white text-sm md:text-base">Breakfast</span>
            </div>
            <p class="text-xs md:text-sm text-slate-300 line-clamp-2">{{ dailyPlan.breakfast.name }}</p>
            <div class="mt-2 flex items-center gap-2">
              <span :class="`text-xs px-2 py-0.5 rounded-full border ${getGlycemicLoadColor(dailyPlan.breakfast.glycemicLoad)}`">
                {{ getGILabel(dailyPlan.breakfast.glycemicLoad) }}
              </span>
            </div>
          </div>

          <!-- Lunch -->
          <div class="bg-slate-700/50 rounded-lg md:rounded-xl p-3 md:p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-lg md:text-xl">☀️</span>
              <span class="font-semibold text-white text-sm md:text-base">Lunch</span>
            </div>
            <p class="text-xs md:text-sm text-slate-300 line-clamp-2">{{ dailyPlan.lunch.name }}</p>
            <div class="mt-2 flex items-center gap-2">
              <span :class="`text-xs px-2 py-0.5 rounded-full border ${getGlycemicLoadColor(dailyPlan.lunch.glycemicLoad)}`">
                {{ getGILabel(dailyPlan.lunch.glycemicLoad) }}
              </span>
            </div>
          </div>

          <!-- Dinner -->
          <div class="bg-slate-700/50 rounded-lg md:rounded-xl p-3 md:p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-lg md:text-xl">🌙</span>
              <span class="font-semibold text-white text-sm md:text-base">Dinner</span>
            </div>
            <p class="text-xs md:text-sm text-slate-300 line-clamp-2">{{ dailyPlan.dinner.name }}</p>
            <div class="mt-2 flex items-center gap-2">
              <span :class="`text-xs px-2 py-0.5 rounded-full border ${getGlycemicLoadColor(dailyPlan.dinner.glycemicLoad)}`">
                {{ getGILabel(dailyPlan.dinner.glycemicLoad) }}
              </span>
            </div>
          </div>

          <!-- Snacks -->
          <div class="bg-slate-700/50 rounded-lg md:rounded-xl p-3 md:p-4">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-lg md:text-xl">🍎</span>
              <span class="font-semibold text-white text-sm md:text-base">Snacks</span>
            </div>
            <p class="text-xs md:text-sm text-slate-300">{{ dailyPlan.snacks.length }} options</p>
            <div class="mt-2 flex items-center gap-2">
              <span class="text-xs text-slate-400">{{ dailyPlan.totalDailyCarbs }}g carbs/day</span>
            </div>
          </div>
        </div>
        
        <div class="mt-3 md:mt-4 p-3 md:p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg md:rounded-xl">
          <p class="text-blue-300 text-xs md:text-sm">{{ dailyPlan.summary }}</p>
        </div>
      </div>

      <!-- Meal Recommendations -->
      <div>
        <h3 class="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Recommended {{ selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1) }} Options</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <div 
            v-for="meal in mealRecommendations.slice(0, 6)" 
            :key="meal.id"
            @click="selectedMeal = meal"
            :class="[
              'bg-slate-800 rounded-xl p-4 md:p-5 border cursor-pointer transition-all',
              selectedMeal?.id === meal.id 
                ? 'border-cyan-500 ring-2 ring-cyan-500/20' 
                : 'border-slate-700 hover:border-slate-600'
            ]"
          >
            <div class="flex items-start justify-between mb-2 md:mb-3">
              <h4 class="font-semibold text-white text-sm md:text-base line-clamp-2 pr-2">{{ meal.name }}</h4>
              <span :class="`text-xs px-2 py-0.5 rounded-full font-medium border flex-shrink-0 ${getGlycemicLoadColor(meal.glycemicLoad)}`">
                {{ getGILabel(meal.glycemicLoad) }}
              </span>
            </div>

            <div class="space-y-1 mb-3">
              <div v-for="food in meal.foods.slice(0, 2)" :key="food.id" class="flex items-center gap-2 text-xs md:text-sm text-slate-400">
                <span class="text-slate-500">•</span>
                <span class="truncate">{{ food.name }}</span>
                <span class="text-slate-600 flex-shrink-0">({{ food.glycemicIndex }})</span>
              </div>
              <div v-if="meal.foods.length > 2" class="text-xs text-slate-500">
                +{{ meal.foods.length - 2 }} more
              </div>
            </div>

            <div class="grid grid-cols-4 gap-2 pt-3 border-t border-slate-700">
              <div class="text-center">
                <Flame class="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-400 mx-auto mb-1" />
                <span class="text-xs text-slate-400">{{ meal.totalCalories }}</span>
              </div>
              <div class="text-center">
                <Wheat class="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-400 mx-auto mb-1" />
                <span class="text-xs text-slate-400">{{ meal.totalCarbs }}g</span>
              </div>
              <div class="text-center">
                <Leaf class="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-400 mx-auto mb-1" />
                <span class="text-xs text-slate-400">{{ meal.totalProtein }}g</span>
              </div>
              <div class="text-center">
                <Droplets class="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-400 mx-auto mb-1" />
                <span class="text-xs text-slate-400">{{ meal.totalFat }}g</span>
              </div>
            </div>

            <div class="mt-2 md:mt-3 text-xs text-cyan-400">
              Glucose: {{ meal.predictedGlucoseChange > 0 ? '+' : '' }}{{ meal.predictedGlucoseChange }} mg/dL
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Meal Detail Modal -->
      <div v-if="selectedMeal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg md:text-xl font-bold text-white pr-4">{{ selectedMeal.name }}</h3>
            <button @click="selectedMeal = null" class="p-2 text-slate-400 hover:text-white flex-shrink-0">
              <X :size="24" />
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <h4 class="font-semibold text-slate-300 mb-3">Food Items</h4>
              <div class="space-y-2">
                <div v-for="food in selectedMeal.foods" :key="food.id" class="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div class="min-w-0">
                    <span class="text-white text-sm">{{ food.name }}</span>
                    <span class="text-xs text-slate-500 ml-2">{{ food.hindiName }}</span>
                  </div>
                  <div class="text-right text-xs md:text-sm flex-shrink-0">
                    <span class="text-slate-400">{{ food.servingSize }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 class="font-semibold text-slate-300 mb-3">AI Recommendations</h4>
              <div class="space-y-2">
                <div v-for="(rec, i) in selectedMeal.recommendations" :key="i" class="flex items-start gap-2 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <CheckCircle2 class="w-4 h-4 md:w-5 md:h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span class="text-emerald-300 text-xs md:text-sm">{{ rec }}</span>
                </div>
              </div>

              <div v-if="selectedMeal.warnings.length > 0" class="mt-4">
                <h4 class="font-semibold text-slate-300 mb-3">Warnings</h4>
                <div class="space-y-2">
                  <div v-for="(warning, i) in selectedMeal.warnings" :key="i" class="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertTriangle class="w-4 h-4 md:w-5 md:h-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <span class="text-red-300 text-xs md:text-sm">{{ warning }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-in {
  animation: fade-in 0.3s ease-out;
}

.touch-manipulation {
  touch-action: manipulation;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
