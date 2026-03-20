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
  X,
  Calendar
} from 'lucide-vue-next'
import { getMealRecommendations, generateDailyPlan, MealPlan } from '../ai/dietEngine'

const currentGlucose   = ref(140)
const targetGlucose    = ref(100)
const selectedMealType = ref<'breakfast'|'lunch'|'dinner'|'snack'>('breakfast')
const selectedRegion   = ref<'north'|'south'|'east'|'west'|'any'>('any')
const showDailyPlan    = ref(false)
const isLoading        = ref(false)
const selectedMeal     = ref<MealPlan|null>(null)

const mealRecommendations = computed(() =>
  getMealRecommendations({
    currentGlucose: currentGlucose.value,
    targetGlucose:  targetGlucose.value,
    mealType:       selectedMealType.value,
    region:         selectedRegion.value
  })
)

const dailyPlan = computed(() =>
  generateDailyPlan(currentGlucose.value, targetGlucose.value)
)

function refreshRecommendations() {
  isLoading.value = true
  setTimeout(() => isLoading.value = false, 500)
}

function glBadgeClass(load: string) {
  switch (load) {
    case 'low':    return 'badge-success'
    case 'medium': return 'badge-warning'
    case 'high':   return 'badge-danger'
    default:       return 'badge-info'
  }
}

function getGILabel(load: string) {
  return { low: 'Low GI', medium: 'Med GI', high: 'High GI' }[load] ?? load
}

const mealEmoji: Record<string, string> = {
  breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎'
}
</script>

<template>
  <div class="space-y-6">

    <!-- ── Header / Controls ── -->
    <div class="card-premium">
      <div class="flex items-center gap-3 mb-5">
        <div class="w-11 h-11 rounded-2xl flex items-center justify-center" style="background:#fff7ed;color:#c2410c;">
          <ChefHat class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-stone-800 tracking-tight">AI Meal Planner</h2>
          <p class="text-stone-400 text-sm">Personalized recommendations based on your glucose</p>
        </div>
      </div>

      <!-- Controls grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">

        <!-- Current Glucose -->
        <div class="col-span-2 md:col-span-1">
          <label class="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
            Current Glucose (mg/dL)
          </label>
          <div class="flex items-center gap-2">
            <button
              @click="currentGlucose = Math.max(70, currentGlucose - 10); refreshRecommendations()"
              class="w-9 h-9 flex items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-all"
            >
              <Minus class="w-4 h-4" />
            </button>
            <input
              v-model.number="currentGlucose"
              type="number"
              @change="refreshRecommendations()"
              class="input-field text-center font-bold text-stone-800"
              style="padding:0.5rem"
            />
            <button
              @click="currentGlucose = Math.min(400, currentGlucose + 10); refreshRecommendations()"
              class="w-9 h-9 flex items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 hover:border-stone-300 transition-all"
            >
              <Plus class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Target -->
        <div>
          <label class="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">Target (mg/dL)</label>
          <input
            v-model.number="targetGlucose"
            type="number"
            @change="refreshRecommendations()"
            class="input-field text-center font-bold text-stone-800"
          />
        </div>

        <!-- Meal Type -->
        <div>
          <label class="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">Meal Type</label>
          <select v-model="selectedMealType" @change="refreshRecommendations()" class="input-field">
            <option value="breakfast">🌅 Breakfast</option>
            <option value="lunch">☀️ Lunch</option>
            <option value="dinner">🌙 Dinner</option>
            <option value="snack">🍎 Snack</option>
          </select>
        </div>

        <!-- Region -->
        <div>
          <label class="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">Region</label>
          <select v-model="selectedRegion" @change="refreshRecommendations()" class="input-field">
            <option value="any">🌍 Any Region</option>
            <option value="north">🍛 North Indian</option>
            <option value="south">🥥 South Indian</option>
            <option value="east">🐟 East Indian</option>
            <option value="west">🌶️ West Indian</option>
          </select>
        </div>
      </div>

      <!-- Daily plan toggle -->
      <div class="mt-5 pt-4 border-t border-stone-100">
        <button
          @click="showDailyPlan = !showDailyPlan"
          class="btn-primary"
        >
          <Calendar class="w-4 h-4" />
          {{ showDailyPlan ? 'Hide' : 'View' }} Full Day Plan
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-14">
      <Loader2 class="w-10 h-10 text-teal-500 animate-spin mb-3" />
      <p class="text-stone-600 font-medium">AI is analyzing your glucose…</p>
      <p class="text-stone-400 text-sm mt-1">Finding optimal meals</p>
    </div>

    <div v-else class="space-y-6">

      <!-- ── Daily Plan ── -->
      <div v-if="showDailyPlan" class="card-premium animate-fade-in">
        <h3 class="section-title mb-4 flex items-center gap-2">
          <Calendar class="w-4.5 h-4.5 text-teal-500" style="width:18px;height:18px" />
          Complete Daily Plan
        </h3>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div
            v-for="(meal, key) in { breakfast: dailyPlan.breakfast, lunch: dailyPlan.lunch, dinner: dailyPlan.dinner }"
            :key="key"
            class="daily-meal-card"
          >
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xl">{{ mealEmoji[key] }}</span>
              <span class="font-semibold text-stone-700 text-sm capitalize">{{ key }}</span>
            </div>
            <p class="text-xs text-stone-600 leading-snug line-clamp-2">{{ meal.name }}</p>
            <div class="mt-2">
              <span :class="['badge', glBadgeClass(meal.glycemicLoad)]">{{ getGILabel(meal.glycemicLoad) }}</span>
            </div>
          </div>

          <div class="daily-meal-card">
            <div class="flex items-center gap-2 mb-2">
              <span class="text-xl">🍎</span>
              <span class="font-semibold text-stone-700 text-sm">Snacks</span>
            </div>
            <p class="text-xs text-stone-600">{{ dailyPlan.snacks.length }} options available</p>
            <div class="mt-2 text-xs text-stone-400">{{ dailyPlan.totalDailyCarbs }}g carbs/day</div>
          </div>
        </div>

        <div class="mt-4 p-4 rounded-xl" style="background:#eff6ff;border:1px solid rgba(59,130,246,0.15);">
          <div class="flex items-start gap-2">
            <Info class="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p class="text-blue-700 text-sm">{{ dailyPlan.summary }}</p>
          </div>
        </div>
      </div>

      <!-- ── Meal Recommendations ── -->
      <div>
        <h3 class="section-title mb-4">
          {{ mealEmoji[selectedMealType] }}
          Recommended {{ selectedMealType.charAt(0).toUpperCase() + selectedMealType.slice(1) }} Options
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="meal in mealRecommendations.slice(0, 6)"
            :key="meal.id"
            @click="selectedMeal = meal"
            :class="[
              'meal-card',
              selectedMeal?.id === meal.id ? 'meal-card--selected' : ''
            ]"
          >
            <div class="flex items-start justify-between gap-2 mb-2.5">
              <h4 class="font-semibold text-stone-800 text-sm leading-snug">{{ meal.name }}</h4>
              <span :class="['badge flex-shrink-0', glBadgeClass(meal.glycemicLoad)]">{{ getGILabel(meal.glycemicLoad) }}</span>
            </div>

            <div class="space-y-1 mb-3">
              <div
                v-for="food in meal.foods.slice(0, 2)"
                :key="food.id"
                class="flex items-center gap-1.5 text-xs text-stone-500"
              >
                <span class="text-stone-300">•</span>
                <span class="truncate">{{ food.name }}</span>
                <span class="text-stone-300 flex-shrink-0">(GI {{ food.glycemicIndex }})</span>
              </div>
              <div v-if="meal.foods.length > 2" class="text-xs text-stone-400">
                +{{ meal.foods.length - 2 }} more items
              </div>
            </div>

            <!-- Nutrition strip -->
            <div class="grid grid-cols-4 gap-1 pt-3 border-t border-stone-100">
              <div class="text-center">
                <Flame class="w-3.5 h-3.5 text-orange-400 mx-auto mb-0.5" />
                <div class="text-xs text-stone-500 font-medium">{{ meal.totalCalories }}</div>
                <div class="text-xs text-stone-400" style="font-size:0.6rem;">kcal</div>
              </div>
              <div class="text-center">
                <Wheat class="w-3.5 h-3.5 text-amber-500 mx-auto mb-0.5" />
                <div class="text-xs text-stone-500 font-medium">{{ meal.totalCarbs }}g</div>
                <div class="text-xs text-stone-400" style="font-size:0.6rem;">carbs</div>
              </div>
              <div class="text-center">
                <Leaf class="w-3.5 h-3.5 text-emerald-500 mx-auto mb-0.5" />
                <div class="text-xs text-stone-500 font-medium">{{ meal.totalProtein }}g</div>
                <div class="text-xs text-stone-400" style="font-size:0.6rem;">protein</div>
              </div>
              <div class="text-center">
                <Droplets class="w-3.5 h-3.5 text-blue-400 mx-auto mb-0.5" />
                <div class="text-xs text-stone-500 font-medium">{{ meal.totalFat }}g</div>
                <div class="text-xs text-stone-400" style="font-size:0.6rem;">fat</div>
              </div>
            </div>

            <!-- Glucose prediction -->
            <div class="mt-2.5 flex items-center gap-1.5">
              <div class="w-1.5 h-1.5 rounded-full bg-teal-400" />
              <span class="text-xs font-semibold text-teal-600">
                Glucose: {{ meal.predictedGlucoseChange > 0 ? '+' : '' }}{{ meal.predictedGlucoseChange }} mg/dL
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ── Meal Detail Modal ── -->
    <Transition name="modal-fade">
      <div v-if="selectedMeal" class="fixed inset-0 z-50 flex items-center justify-center p-4" style="background:rgba(0,0,0,0.4);">
        <div class="modal-panel">
          <div class="flex items-center justify-between mb-5">
            <h3 class="text-lg font-bold text-stone-800 pr-4 leading-snug">{{ selectedMeal.name }}</h3>
            <button
              @click="selectedMeal = null"
              class="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors flex-shrink-0"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Foods -->
            <div>
              <h4 class="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">Food Items</h4>
              <div class="space-y-2">
                <div
                  v-for="food in selectedMeal.foods"
                  :key="food.id"
                  class="flex items-center justify-between p-3 rounded-xl"
                  style="background:#f5f5f4;"
                >
                  <div class="min-w-0">
                    <span class="text-stone-800 text-sm font-medium">{{ food.name }}</span>
                    <span class="text-xs text-stone-400 ml-1.5">{{ food.hindiName }}</span>
                  </div>
                  <span class="text-xs text-stone-500 flex-shrink-0 ml-2">{{ food.servingSize }}</span>
                </div>
              </div>
            </div>

            <!-- Recommendations & Warnings -->
            <div class="space-y-4">
              <div>
                <h4 class="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">AI Recommendations</h4>
                <div class="space-y-2">
                  <div
                    v-for="(rec, i) in selectedMeal.recommendations"
                    :key="i"
                    class="flex items-start gap-2 p-3 rounded-xl"
                    style="background:#f0fdf4;border:1px solid rgba(34,197,94,0.2);"
                  >
                    <CheckCircle2 class="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span class="text-emerald-800 text-xs leading-relaxed">{{ rec }}</span>
                  </div>
                </div>
              </div>

              <div v-if="selectedMeal.warnings.length > 0">
                <h4 class="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-3">Cautions</h4>
                <div class="space-y-2">
                  <div
                    v-for="(warning, i) in selectedMeal.warnings"
                    :key="i"
                    class="flex items-start gap-2 p-3 rounded-xl"
                    style="background:#fef2f2;border:1px solid rgba(239,68,68,0.15);"
                  >
                    <AlertTriangle class="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    <span class="text-red-700 text-xs leading-relaxed">{{ warning }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.animate-fade-in { animation: fadeIn 0.3s ease both; }

/* Meal cards */
.meal-card {
  background: white;
  border: 1.5px solid #e7e5e4;
  border-radius: 16px;
  padding: 1.125rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.meal-card:hover {
  border-color: #14b8a6;
  box-shadow: 0 4px 16px rgba(20,184,166,0.12);
  transform: translateY(-1px);
}

.meal-card--selected {
  border-color: #14b8a6;
  box-shadow: 0 0 0 3px rgba(20,184,166,0.12), 0 4px 16px rgba(20,184,166,0.12);
}

/* Daily plan mini-cards */
.daily-meal-card {
  background: #f5f5f4;
  border: 1px solid #e7e5e4;
  border-radius: 14px;
  padding: 0.875rem;
}

/* Modal */
.modal-panel {
  background: white;
  border-radius: 24px;
  padding: 1.75rem;
  max-width: 680px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 64px rgba(0,0,0,0.15);
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: all 0.25s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-panel {
  transform: scale(0.96) translateY(8px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
