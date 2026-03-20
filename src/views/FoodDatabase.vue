<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, ChevronDown, ChevronUp, X, Leaf } from 'lucide-vue-next'
import { indianFoods } from '../data/indianFoods'
import type { FoodItem } from '../data/indianFoods'

type RegionFilter = 'all' | FoodItem['region']
type CategoryFilter = 'all' | FoodItem['category']
type GIFilter = 'all' | FoodItem['glycemicLoad']

const searchQuery = ref('')
const regionFilter = ref<RegionFilter>('all')
const categoryFilter = ref<CategoryFilter>('all')
const giFilter = ref<GIFilter>('all')
const expandedFood = ref<string | null>(null)
const showFilters = ref(false)

const regions: { id: RegionFilter; label: string }[] = [
  { id: 'all', label: 'All Regions' },
  { id: 'north', label: 'North India' },
  { id: 'south', label: 'South India' },
  { id: 'east', label: 'East India' },
  { id: 'west', label: 'West India' },
  { id: 'pan-india', label: 'Pan India' },
]

const categories: { id: CategoryFilter; label: string; emoji: string }[] = [
  { id: 'all', label: 'All', emoji: '🍱' },
  { id: 'grain', label: 'Grains', emoji: '🌾' },
  { id: 'pulse', label: 'Pulses', emoji: '🫘' },
  { id: 'vegetable', label: 'Veggies', emoji: '🥦' },
  { id: 'dairy', label: 'Dairy', emoji: '🥛' },
  { id: 'meat', label: 'Meat', emoji: '🍗' },
  { id: 'snack', label: 'Snacks', emoji: '🥨' },
  { id: 'beverage', label: 'Drinks', emoji: '☕' },
  { id: 'fruit', label: 'Fruits', emoji: '🍎' },
]

const giFilters: { id: GIFilter; label: string; color: string }[] = [
  { id: 'all', label: 'All GI', color: 'bg-gray-100 text-gray-600' },
  { id: 'low', label: 'Low GI', color: 'bg-teal-100 text-teal-700' },
  { id: 'medium', label: 'Medium GI', color: 'bg-amber-100 text-amber-700' },
  { id: 'high', label: 'High GI', color: 'bg-red-100 text-red-700' },
]

const filteredFoods = computed<FoodItem[]>(() => {
  const q = searchQuery.value.toLowerCase().trim()
  return indianFoods.filter(food => {
    if (regionFilter.value !== 'all' && food.region !== regionFilter.value) return false
    if (categoryFilter.value !== 'all' && food.category !== categoryFilter.value) return false
    if (giFilter.value !== 'all' && food.glycemicLoad !== giFilter.value) return false
    if (q) {
      return (
        food.name.toLowerCase().includes(q) ||
        food.hindiName.toLowerCase().includes(q) ||
        food.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    return true
  })
})

const activeFilterCount = computed(() => {
  let count = 0
  if (regionFilter.value !== 'all') count++
  if (categoryFilter.value !== 'all') count++
  if (giFilter.value !== 'all') count++
  return count
})

function resetFilters() {
  regionFilter.value = 'all'
  categoryFilter.value = 'all'
  giFilter.value = 'all'
  searchQuery.value = ''
}

function toggleExpand(id: string) {
  expandedFood.value = expandedFood.value === id ? null : id
}

function giConfig(load: FoodItem['glycemicLoad']) {
  return load === 'low'
    ? { badge: 'bg-teal-50 text-teal-700 border-teal-200', bar: 'bg-teal-500' }
    : load === 'medium'
    ? { badge: 'bg-amber-50 text-amber-700 border-amber-200', bar: 'bg-amber-400' }
    : { badge: 'bg-red-50 text-red-700 border-red-200', bar: 'bg-red-400' }
}

function regionLabel(r: FoodItem['region']): string {
  const map: Record<FoodItem['region'], string> = {
    north: 'North', south: 'South', east: 'East', west: 'West', 'pan-india': 'Pan India',
  }
  return map[r]
}

const totalFoods = indianFoods.length
const lowGICount = indianFoods.filter(f => f.glycemicLoad === 'low').length
</script>

<template>
  <div class="px-4 py-5 max-w-4xl mx-auto space-y-4 lg:px-6 lg:py-6">

    <!-- Header -->
    <div>
      <h2 class="text-xl font-bold text-gray-900">Food Database</h2>
      <p class="text-sm text-gray-500 mt-0.5">{{ totalFoods }} Indian foods with glycemic index data · {{ lowGICount }} diabetes-friendly</p>
    </div>

    <!-- Quick stats -->
    <div class="grid grid-cols-4 gap-2">
      <div class="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
        <p class="text-lg font-bold text-gray-900">{{ totalFoods }}</p>
        <p class="text-[10px] text-gray-500">Total Foods</p>
      </div>
      <div class="bg-teal-50 rounded-xl p-3 border border-teal-100 text-center">
        <p class="text-lg font-bold text-teal-700">{{ indianFoods.filter(f => f.glycemicLoad === 'low').length }}</p>
        <p class="text-[10px] text-teal-600">Low GI</p>
      </div>
      <div class="bg-amber-50 rounded-xl p-3 border border-amber-100 text-center">
        <p class="text-lg font-bold text-amber-700">{{ indianFoods.filter(f => f.glycemicLoad === 'medium').length }}</p>
        <p class="text-[10px] text-amber-600">Medium GI</p>
      </div>
      <div class="bg-red-50 rounded-xl p-3 border border-red-100 text-center">
        <p class="text-lg font-bold text-red-700">{{ indianFoods.filter(f => f.glycemicLoad === 'high').length }}</p>
        <p class="text-[10px] text-red-600">High GI</p>
      </div>
    </div>

    <!-- Search -->
    <div class="relative">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search foods (English or Hindi)..."
        class="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
      />
      <button v-if="searchQuery" @click="searchQuery = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
        <X class="w-4 h-4" />
      </button>
    </div>

    <!-- Category quick-select -->
    <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="categoryFilter = cat.id"
        class="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border flex-shrink-0 min-h-[36px]"
        :class="categoryFilter === cat.id
          ? 'bg-gray-900 text-white border-gray-900'
          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'"
      >
        {{ cat.emoji }} {{ cat.label }}
      </button>
    </div>

    <!-- Filters toggle -->
    <div>
      <button
        @click="showFilters = !showFilters"
        class="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
      >
        <span>More Filters</span>
        <span v-if="activeFilterCount > 0" class="bg-teal-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {{ activeFilterCount }}
        </span>
        <ChevronDown v-if="!showFilters" class="w-4 h-4" />
        <ChevronUp v-else class="w-4 h-4" />
      </button>

      <div v-if="showFilters" class="mt-3 space-y-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <!-- Region filter -->
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Region</p>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="r in regions"
              :key="r.id"
              @click="regionFilter = r.id"
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
              :class="regionFilter === r.id
                ? 'bg-teal-500 text-white border-teal-500'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-teal-300'"
            >{{ r.label }}</button>
          </div>
        </div>

        <!-- GI Load filter -->
        <div>
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Glycemic Load</p>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="g in giFilters"
              :key="g.id"
              @click="giFilter = g.id"
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border"
              :class="giFilter === g.id
                ? `${g.color} border-current`
                : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300'"
            >{{ g.label }}</button>
          </div>
        </div>

        <button
          v-if="activeFilterCount > 0"
          @click="resetFilters"
          class="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
        >
          <X class="w-3 h-3" /> Clear all filters
        </button>
      </div>
    </div>

    <!-- Result count -->
    <div class="flex items-center justify-between">
      <p class="text-sm text-gray-500">
        <span class="font-semibold text-gray-900">{{ filteredFoods.length }}</span> foods found
      </p>
      <div v-if="activeFilterCount > 0 || searchQuery" class="flex items-center gap-1.5">
        <span class="text-xs text-gray-400">Active filters</span>
        <button @click="resetFilters" class="text-xs text-teal-600 hover:text-teal-800 font-medium">Reset</button>
      </div>
    </div>

    <!-- No results -->
    <div v-if="filteredFoods.length === 0" class="bg-white rounded-2xl border border-gray-100 p-8 text-center">
      <Leaf class="w-10 h-10 text-gray-300 mx-auto mb-3" />
      <p class="text-gray-600 font-medium">No foods match your search</p>
      <p class="text-sm text-gray-400 mt-1">Try a different search term or clear your filters</p>
      <button @click="resetFilters" class="mt-3 text-sm text-teal-600 hover:text-teal-800 font-medium">Clear filters</button>
    </div>

    <!-- Food list -->
    <div v-else class="space-y-2">
      <div
        v-for="food in filteredFoods"
        :key="food.id"
        class="bg-white rounded-2xl border shadow-sm overflow-hidden transition-all"
        :class="expandedFood === food.id ? 'border-teal-200' : 'border-gray-100'"
      >
        <!-- Food row -->
        <button
          class="w-full p-4 flex items-center gap-3 text-left hover:bg-gray-50/50 transition-colors"
          @click="toggleExpand(food.id)"
        >
          <!-- GI indicator dot -->
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
            :class="giConfig(food.glycemicLoad).badge"
          >
            {{ food.category === 'grain' ? '🌾'
              : food.category === 'pulse' ? '🫘'
              : food.category === 'vegetable' ? '🥦'
              : food.category === 'dairy' ? '🥛'
              : food.category === 'meat' ? '🍗'
              : food.category === 'snack' ? '🥨'
              : food.category === 'beverage' ? '☕'
              : food.category === 'fruit' ? '🍎'
              : '🍱' }}
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <p class="text-sm font-semibold text-gray-900 truncate">{{ food.name }}</p>
                <p class="text-xs text-gray-400">{{ food.hindiName }} · {{ food.servingSize }}</p>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span class="text-[10px] font-semibold border rounded-full px-2 py-0.5" :class="giConfig(food.glycemicLoad).badge">
                  {{ food.glycemicLoad.toUpperCase() }} GI
                </span>
                <ChevronDown v-if="expandedFood !== food.id" class="w-4 h-4 text-gray-400" />
                <ChevronUp v-else class="w-4 h-4 text-teal-500" />
              </div>
            </div>

            <!-- Mini nutrition row -->
            <div class="flex gap-3 mt-1.5">
              <span class="text-xs text-gray-500"><span class="font-semibold text-gray-700">{{ food.carbs }}g</span> carbs</span>
              <span class="text-xs text-gray-500"><span class="font-semibold text-gray-700">{{ food.protein }}g</span> protein</span>
              <span class="text-xs text-gray-500"><span class="font-semibold text-gray-700">{{ food.calories }}</span> kcal</span>
            </div>
          </div>
        </button>

        <!-- Expanded detail -->
        <div v-if="expandedFood === food.id" class="border-t border-gray-100 p-4 bg-gray-50/50 space-y-3">

          <!-- Full nutrition grid -->
          <div class="grid grid-cols-3 gap-2 sm:grid-cols-6">
            <div class="bg-white rounded-xl p-2.5 text-center border border-gray-100">
              <p class="text-sm font-bold text-gray-900">{{ food.carbs }}g</p>
              <p class="text-[10px] text-gray-400">Carbs</p>
            </div>
            <div class="bg-white rounded-xl p-2.5 text-center border border-gray-100">
              <p class="text-sm font-bold text-gray-900">{{ food.protein }}g</p>
              <p class="text-[10px] text-gray-400">Protein</p>
            </div>
            <div class="bg-white rounded-xl p-2.5 text-center border border-gray-100">
              <p class="text-sm font-bold text-gray-900">{{ food.fat }}g</p>
              <p class="text-[10px] text-gray-400">Fat</p>
            </div>
            <div class="bg-white rounded-xl p-2.5 text-center border border-gray-100">
              <p class="text-sm font-bold text-gray-900">{{ food.fiber }}g</p>
              <p class="text-[10px] text-gray-400">Fiber</p>
            </div>
            <div class="bg-white rounded-xl p-2.5 text-center border border-gray-100">
              <p class="text-sm font-bold text-gray-900">{{ food.calories }}</p>
              <p class="text-[10px] text-gray-400">kcal</p>
            </div>
            <div class="bg-white rounded-xl p-2.5 text-center border border-gray-100">
              <p class="text-sm font-bold text-gray-900">{{ food.glycemicIndex }}</p>
              <p class="text-[10px] text-gray-400">GI Score</p>
            </div>
          </div>

          <!-- GI bar -->
          <div>
            <div class="flex items-center justify-between mb-1">
              <span class="text-xs text-gray-500">Glycemic Index</span>
              <span class="text-xs font-semibold" :class="giConfig(food.glycemicLoad).badge.split(' ')[1]">
                {{ food.glycemicIndex }} ({{ food.glycemicLoad }})
              </span>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all"
                :class="giConfig(food.glycemicLoad).bar"
                :style="{ width: Math.min(food.glycemicIndex, 100) + '%' }"
              />
            </div>
            <div class="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>Low (&lt;55)</span>
              <span>Medium (55–70)</span>
              <span>High (&gt;70)</span>
            </div>
          </div>

          <!-- Tags + Region -->
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-[10px] bg-gray-100 text-gray-600 rounded-full px-2 py-1 font-medium">
              📍 {{ regionLabel(food.region) }}
            </span>
            <span
              v-for="tag in food.tags.slice(0, 4)"
              :key="tag"
              class="text-[10px] bg-teal-50 text-teal-700 rounded-full px-2 py-1 font-medium"
            >{{ tag }}</span>
          </div>

          <!-- Diabetes suitability -->
          <div
            class="p-2.5 rounded-xl text-xs flex items-start gap-2"
            :class="food.glycemicLoad === 'low' ? 'bg-teal-50 text-teal-700 border border-teal-100'
              : food.glycemicLoad === 'medium' ? 'bg-amber-50 text-amber-700 border border-amber-100'
              : 'bg-red-50 text-red-700 border border-red-100'"
          >
            <span class="text-base leading-none flex-shrink-0">
              {{ food.glycemicLoad === 'low' ? '✅' : food.glycemicLoad === 'medium' ? '⚠️' : '🚫' }}
            </span>
            <span>
              {{ food.glycemicLoad === 'low'
                ? 'Diabetes-friendly. Safe to include in meals — minimal glucose impact.'
                : food.glycemicLoad === 'medium'
                ? 'Moderate glycemic impact. Eat with protein/fiber to slow absorption.'
                : 'High glycemic load. Limit portions and pair with low-GI foods.' }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer note -->
    <p class="text-xs text-gray-400 text-center pb-2">
      GI data based on standard serving sizes. Individual responses may vary. Consult Dr. Rais for personalized guidance.
    </p>

  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
