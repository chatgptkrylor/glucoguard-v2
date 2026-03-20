<script setup lang="ts">
import { ref, computed } from 'vue'
import { UtensilsCrossed, Leaf, Flame, Zap, ChevronDown, ChevronUp, Info } from 'lucide-vue-next'
import { getMealRecommendations } from '../ai/dietEngine'
import type { MealPlan } from '../ai/dietEngine'

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack'
type Region = 'any' | 'north' | 'south' | 'east' | 'west'

const mealType = ref<MealType>('breakfast')
const region = ref<Region>('any')
const currentGlucose = ref(140)
const expandedPlan = ref<string | null>(null)

const mealTypes: { id: MealType; label: string; emoji: string }[] = [
  { id: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { id: 'lunch', label: 'Lunch', emoji: '☀️' },
  { id: 'dinner', label: 'Dinner', emoji: '🌙' },
  { id: 'snack', label: 'Snack', emoji: '🍎' },
]

const regions: { id: Region; label: string }[] = [
  { id: 'any', label: 'All India' },
  { id: 'north', label: 'North' },
  { id: 'south', label: 'South' },
  { id: 'east', label: 'East' },
  { id: 'west', label: 'West' },
]

const recommendations = computed<MealPlan[]>(() =>
  getMealRecommendations({
    currentGlucose: currentGlucose.value,
    targetGlucose: 120,
    mealType: mealType.value,
    region: region.value,
  })
)

function giColor(load: 'low' | 'medium' | 'high'): string {
  return load === 'low' ? 'text-teal-700 bg-teal-50 border-teal-200'
    : load === 'medium' ? 'text-amber-700 bg-amber-50 border-amber-200'
    : 'text-red-700 bg-red-50 border-red-200'
}

function glucoseColor(change: number): string {
  if (change < 20) return 'text-teal-600'
  if (change < 40) return 'text-amber-600'
  return 'text-red-600'
}

function toggleExpand(id: string) {
  expandedPlan.value = expandedPlan.value === id ? null : id
}

const glucoseStatusBg = computed(() => {
  if (currentGlucose.value < 70) return 'bg-red-50 border-red-200 text-red-700'
  if (currentGlucose.value <= 140) return 'bg-teal-50 border-teal-200 text-teal-700'
  if (currentGlucose.value <= 180) return 'bg-amber-50 border-amber-200 text-amber-700'
  return 'bg-red-50 border-red-200 text-red-700'
})

const glucoseStatusLabel = computed(() => {
  if (currentGlucose.value < 70) return 'Low — eat now'
  if (currentGlucose.value <= 140) return 'In Target Range'
  if (currentGlucose.value <= 180) return 'Slightly Elevated'
  return 'High — choose low GI'
})
</script>

<template>
  <div class="px-4 py-5 max-w-4xl mx-auto space-y-4 lg:px-6 lg:py-6">

    <!-- Header -->
    <div>
      <h2 class="text-xl font-bold text-gray-900">Meal Planner</h2>
      <p class="text-sm text-gray-500 mt-0.5">AI-powered Indian meal recommendations for your glucose level</p>
    </div>

    <!-- Current Glucose Input -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-gray-900">Current Glucose</h3>
        <span class="text-xs border rounded-full px-2.5 py-0.5 font-medium" :class="glucoseStatusBg">
          {{ glucoseStatusLabel }}
        </span>
      </div>
      <div class="flex items-center gap-3">
        <input
          v-model.number="currentGlucose"
          type="range"
          min="60"
          max="300"
          step="5"
          class="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-teal-500"
        />
        <div class="bg-teal-50 border border-teal-200 rounded-xl px-3 py-1.5 text-center min-w-[72px]">
          <p class="text-lg font-bold text-teal-700 leading-none">{{ currentGlucose }}</p>
          <p class="text-[10px] text-teal-500">mg/dL</p>
        </div>
      </div>
      <p class="text-xs text-gray-400 mt-2">Drag to adjust or enter your current glucose reading</p>
    </div>

    <!-- Meal Type + Region Selectors -->
    <div class="space-y-3">
      <!-- Meal type -->
      <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          v-for="m in mealTypes"
          :key="m.id"
          @click="mealType = m.id"
          class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all border min-h-[44px] flex-shrink-0"
          :class="mealType === m.id
            ? 'bg-teal-500 text-white border-teal-500 shadow-sm'
            : 'bg-white text-gray-600 border-gray-200 hover:border-teal-300'"
        >
          <span>{{ m.emoji }}</span>
          {{ m.label }}
        </button>
      </div>

      <!-- Region -->
      <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          v-for="r in regions"
          :key="r.id"
          @click="region = r.id"
          class="px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border min-h-[36px] flex-shrink-0"
          :class="region === r.id
            ? 'bg-gray-900 text-white border-gray-900'
            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'"
        >{{ r.label }}</button>
      </div>
    </div>

    <!-- No Results -->
    <div v-if="recommendations.length === 0" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
      <UtensilsCrossed class="w-10 h-10 text-gray-300 mx-auto mb-3" />
      <p class="text-gray-500 font-medium">No meal plans found</p>
      <p class="text-sm text-gray-400 mt-1">Try changing the region or meal type</p>
    </div>

    <!-- Meal Plan Cards -->
    <div v-else class="space-y-3">
      <div
        v-for="plan in recommendations"
        :key="plan.id"
        class="bg-white rounded-2xl border shadow-sm overflow-hidden transition-all"
        :class="expandedPlan === plan.id ? 'border-teal-300' : 'border-gray-100'"
      >
        <!-- Card header -->
        <div class="p-4">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-base font-bold text-gray-900">{{ plan.name }}</h3>
                <span class="text-[11px] font-semibold border rounded-full px-2 py-0.5" :class="giColor(plan.glycemicLoad)">
                  GI: {{ plan.glycemicLoad.toUpperCase() }}
                </span>
              </div>
              <div class="flex flex-wrap gap-1.5 mt-2">
                <span
                  v-for="food in plan.foods"
                  :key="food.id"
                  class="text-xs bg-gray-50 text-gray-600 border border-gray-200 rounded-full px-2 py-0.5"
                >{{ food.name }}</span>
              </div>
            </div>
            <button
              @click="toggleExpand(plan.id)"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 flex-shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
            >
              <ChevronDown v-if="expandedPlan !== plan.id" class="w-4 h-4" />
              <ChevronUp v-else class="w-4 h-4" />
            </button>
          </div>

          <!-- Nutrition row -->
          <div class="grid grid-cols-4 gap-2 mt-3">
            <div class="text-center p-2 bg-gray-50 rounded-xl">
              <p class="text-sm font-bold text-gray-900">{{ plan.totalCarbs }}g</p>
              <p class="text-[10px] text-gray-500">Carbs</p>
            </div>
            <div class="text-center p-2 bg-gray-50 rounded-xl">
              <p class="text-sm font-bold text-gray-900">{{ plan.totalProtein }}g</p>
              <p class="text-[10px] text-gray-500">Protein</p>
            </div>
            <div class="text-center p-2 bg-gray-50 rounded-xl">
              <p class="text-sm font-bold text-gray-900">{{ plan.totalCalories }}</p>
              <p class="text-[10px] text-gray-500">kcal</p>
            </div>
            <div class="text-center p-2 rounded-xl" :class="plan.predictedGlucoseChange < 30 ? 'bg-teal-50' : 'bg-amber-50'">
              <p class="text-sm font-bold" :class="glucoseColor(plan.predictedGlucoseChange)">+{{ plan.predictedGlucoseChange }}</p>
              <p class="text-[10px] text-gray-500">mg/dL rise</p>
            </div>
          </div>
        </div>

        <!-- Expanded detail -->
        <div v-if="expandedPlan === plan.id" class="border-t border-gray-100 p-4 space-y-3 bg-gray-50/50">

          <!-- Food breakdown -->
          <div>
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Foods in this meal</p>
            <div class="space-y-2">
              <div
                v-for="food in plan.foods"
                :key="food.id"
                class="flex items-center justify-between text-sm bg-white rounded-xl p-3 border border-gray-100"
              >
                <div>
                  <p class="font-medium text-gray-900">{{ food.name }}</p>
                  <p class="text-xs text-gray-400">{{ food.hindiName }} · {{ food.servingSize }}</p>
                </div>
                <div class="text-right">
                  <p class="text-xs font-semibold text-gray-600">{{ food.carbs }}g carbs</p>
                  <p class="text-xs text-gray-400">GI: {{ food.glycemicIndex }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Recommendations -->
          <div v-if="plan.recommendations.length > 0">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tips</p>
            <ul class="space-y-1.5">
              <li
                v-for="rec in plan.recommendations"
                :key="rec"
                class="flex items-start gap-2 text-sm text-gray-600"
              >
                <Leaf class="w-3.5 h-3.5 text-teal-500 flex-shrink-0 mt-0.5" />
                {{ rec }}
              </li>
            </ul>
          </div>

          <!-- Warnings -->
          <div v-if="plan.warnings.length > 0" class="bg-amber-50 border border-amber-100 rounded-xl p-3">
            <p v-for="w in plan.warnings" :key="w" class="text-xs text-amber-700 flex items-start gap-1.5">
              <Info class="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              {{ w }}
            </p>
          </div>

          <!-- Expected glucose change -->
          <div class="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="plan.predictedGlucoseChange < 30 ? 'bg-teal-50' : 'bg-amber-50'">
              <Flame class="w-4 h-4" :class="plan.predictedGlucoseChange < 30 ? 'text-teal-600' : 'text-amber-600'" />
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-900">
                Expected glucose: {{ currentGlucose + plan.predictedGlucoseChange }} mg/dL
              </p>
              <p class="text-xs text-gray-400">~2 hrs after eating (estimated)</p>
            </div>
            <div class="ml-auto">
              <span class="text-xs font-bold" :class="glucoseColor(plan.predictedGlucoseChange)">
                +{{ plan.predictedGlucoseChange }} mg/dL
              </span>
            </div>
          </div>

          <button class="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold text-sm py-3 rounded-xl transition-colors flex items-center justify-center gap-2 min-h-[48px]">
            <Zap class="w-4 h-4" />
            Log This Meal
          </button>
        </div>
      </div>
    </div>

    <!-- Disclaimer -->
    <div class="flex items-start gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
      <Info class="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
      <p class="text-xs text-blue-700 leading-relaxed">
        Recommendations are AI-generated based on glycemic index data. Always consult your doctor (Dr. Nadeem Rais) before making dietary changes.
      </p>
    </div>

  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
