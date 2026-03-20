<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Search,
  Leaf,
  Flame,
  Wheat,
  Droplets,
  Info,
  MapPin,
  Tag,
  ChevronDown,
  ChevronUp,
  Heart,
  Filter
} from 'lucide-vue-next'
import { indianFoods, FoodItem } from '../data/indianFoods'

const searchQuery         = ref('')
const selectedRegion      = ref<'all'|'north'|'south'|'east'|'west'|'pan-india'>('all')
const selectedCategory    = ref<'all'|'grain'|'pulse'|'vegetable'|'fruit'|'dairy'|'meat'|'snack'|'beverage'>('all')
const selectedGlycemicLoad = ref<'all'|'low'|'medium'|'high'>('all')
const expandedFood        = ref<string|null>(null)

const categories = [
  { id: 'all',      label: 'All Categories' },
  { id: 'grain',    label: 'Grains' },
  { id: 'pulse',    label: 'Pulses' },
  { id: 'vegetable',label: 'Vegetables' },
  { id: 'fruit',    label: 'Fruits' },
  { id: 'dairy',    label: 'Dairy' },
  { id: 'meat',     label: 'Meat & Fish' },
  { id: 'snack',    label: 'Snacks' },
  { id: 'beverage', label: 'Beverages' },
]

const regions = [
  { id: 'all',      label: 'All Regions' },
  { id: 'north',    label: 'North Indian' },
  { id: 'south',    label: 'South Indian' },
  { id: 'east',     label: 'East Indian' },
  { id: 'west',     label: 'West Indian' },
  { id: 'pan-india',label: 'Pan-Indian' },
]

const filteredFoods = computed(() =>
  indianFoods.filter(food => {
    const q = searchQuery.value.toLowerCase()
    const matchSearch   = !q || food.name.toLowerCase().includes(q) || food.hindiName.includes(searchQuery.value) || food.tags.some(t => t.toLowerCase().includes(q))
    const matchRegion   = selectedRegion.value === 'all'          || food.region === selectedRegion.value
    const matchCategory = selectedCategory.value === 'all'        || food.category === selectedCategory.value
    const matchGI       = selectedGlycemicLoad.value === 'all'    || food.glycemicLoad === selectedGlycemicLoad.value
    return matchSearch && matchRegion && matchCategory && matchGI
  })
)

const stats = computed(() => ({
  total:  indianFoods.length,
  lowGI:  indianFoods.filter(f => f.glycemicLoad === 'low').length,
  medGI:  indianFoods.filter(f => f.glycemicLoad === 'medium').length,
  highGI: indianFoods.filter(f => f.glycemicLoad === 'high').length,
}))

const hasFilters = computed(() =>
  searchQuery.value || selectedRegion.value !== 'all' ||
  selectedCategory.value !== 'all' || selectedGlycemicLoad.value !== 'all'
)

function clearFilters() {
  searchQuery.value = ''
  selectedRegion.value = 'all'
  selectedCategory.value = 'all'
  selectedGlycemicLoad.value = 'all'
}

function toggleExpand(id: string) {
  expandedFood.value = expandedFood.value === id ? null : id
}

function glClass(load: string) {
  return {
    low:    { badge: 'badge-success', bar: 'gi-bar--green', text: 'text-emerald-700' },
    medium: { badge: 'badge-warning', bar: 'gi-bar--amber', text: 'text-amber-700' },
    high:   { badge: 'badge-danger',  bar: 'gi-bar--red',   text: 'text-red-700' },
  }[load] ?? { badge: 'badge-info', bar: 'gi-bar--teal', text: 'text-teal-700' }
}

function getRegionEmoji(region: string) {
  return { north: '🇮🇳', south: '🌴', east: '🐟', west: '🏜️', 'pan-india': '🇮🇳' }[region] ?? '🇮🇳'
}

function getHealthNote(load: string) {
  return {
    low:    'Excellent choice for diabetes — minimal blood sugar impact.',
    medium: 'Consume in moderation — watch portion sizes.',
    high:   'Limit consumption — significant blood sugar impact.',
  }[load] ?? ''
}
</script>

<template>
  <div class="space-y-6">

    <!-- ── Header ── -->
    <div class="card-premium">
      <div class="flex items-center gap-3 mb-5">
        <div class="w-11 h-11 rounded-2xl flex items-center justify-center" style="background:#ccfbf1;color:#0d9488;">
          <Wheat class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-stone-800 tracking-tight">Indian Food Database</h2>
          <p class="text-stone-400 text-sm">{{ stats.total }}+ foods with glycemic index & nutrition data</p>
        </div>
      </div>

      <!-- Stats bar -->
      <div class="grid grid-cols-3 gap-3">
        <div class="stat-chip stat-chip--green">
          <div class="text-2xl font-bold">{{ stats.lowGI }}</div>
          <div class="text-xs font-medium mt-0.5">Low GI Foods</div>
        </div>
        <div class="stat-chip stat-chip--amber">
          <div class="text-2xl font-bold">{{ stats.medGI }}</div>
          <div class="text-xs font-medium mt-0.5">Medium GI Foods</div>
        </div>
        <div class="stat-chip stat-chip--red">
          <div class="text-2xl font-bold">{{ stats.highGI }}</div>
          <div class="text-xs font-medium mt-0.5">High GI Foods</div>
        </div>
      </div>
    </div>

    <!-- ── Search & Filters ── -->
    <div class="card">
      <div class="flex flex-col md:flex-row gap-3">
        <!-- Search -->
        <div class="flex-1 relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-stone-400" style="width:18px;height:18px;" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search foods in English or Hindi…"
            class="input-field"
            style="padding-left:2.5rem;"
          />
        </div>

        <!-- Region -->
        <select v-model="selectedRegion" class="input-field md:w-44">
          <option v-for="r in regions" :key="r.id" :value="r.id">{{ r.label }}</option>
        </select>

        <!-- Category -->
        <select v-model="selectedCategory" class="input-field md:w-44">
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.label }}</option>
        </select>

        <!-- GI Level -->
        <select v-model="selectedGlycemicLoad" class="input-field md:w-40">
          <option value="all">All GI Levels</option>
          <option value="low">Low GI (≤10)</option>
          <option value="medium">Medium GI</option>
          <option value="high">High GI (≥20)</option>
        </select>
      </div>

      <div class="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
        <span class="text-stone-400 text-sm">
          Showing <span class="font-semibold text-stone-700">{{ filteredFoods.length }}</span> of {{ stats.total }} foods
        </span>
        <button
          v-if="hasFilters"
          @click="clearFilters"
          class="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          Clear filters
        </button>
      </div>
    </div>

    <!-- ── Food Grid ── -->
    <div v-if="filteredFoods.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="food in filteredFoods"
        :key="food.id"
        :class="['food-card', expandedFood === food.id ? 'food-card--expanded' : '']"
      >
        <!-- Card header -->
        <div class="p-4">
          <div class="flex items-start justify-between gap-2 mb-2.5">
            <div class="min-w-0">
              <h3 class="font-semibold text-stone-800 text-sm leading-snug">{{ food.name }}</h3>
              <p class="text-xs text-stone-400 mt-0.5">{{ food.hindiName }}</p>
            </div>
            <span :class="['badge flex-shrink-0', glClass(food.glycemicLoad).badge]">
              {{ food.glycemicLoad }} GI
            </span>
          </div>

          <!-- Region + category -->
          <div class="flex items-center gap-1.5 mb-3">
            <span class="text-sm">{{ getRegionEmoji(food.region) }}</span>
            <span class="text-xs text-stone-500 capitalize">{{ food.region.replace('-', ' ') }}</span>
            <span class="text-stone-300 mx-0.5">·</span>
            <Tag class="w-3 h-3 text-stone-400" />
            <span class="text-xs text-stone-500 capitalize">{{ food.category }}</span>
          </div>

          <!-- Nutrition strip -->
          <div class="grid grid-cols-4 gap-1 py-2.5 border-t border-b border-stone-100">
            <div class="text-center">
              <Flame class="w-3.5 h-3.5 text-orange-400 mx-auto mb-0.5" />
              <div class="text-xs font-semibold text-stone-700">{{ food.calories }}</div>
              <div class="text-stone-400" style="font-size:0.6rem;">kcal</div>
            </div>
            <div class="text-center">
              <Wheat class="w-3.5 h-3.5 text-amber-500 mx-auto mb-0.5" />
              <div class="text-xs font-semibold text-stone-700">{{ food.carbs }}g</div>
              <div class="text-stone-400" style="font-size:0.6rem;">carbs</div>
            </div>
            <div class="text-center">
              <Leaf class="w-3.5 h-3.5 text-emerald-500 mx-auto mb-0.5" />
              <div class="text-xs font-semibold text-stone-700">{{ food.protein }}g</div>
              <div class="text-stone-400" style="font-size:0.6rem;">protein</div>
            </div>
            <div class="text-center">
              <Droplets class="w-3.5 h-3.5 text-blue-400 mx-auto mb-0.5" />
              <div class="text-xs font-semibold text-stone-700">{{ food.fat }}g</div>
              <div class="text-stone-400" style="font-size:0.6rem;">fat</div>
            </div>
          </div>

          <!-- Expand toggle -->
          <div class="flex items-center justify-between pt-2.5">
            <span class="text-xs text-stone-400">{{ food.servingSize }}</span>
            <button
              @click="toggleExpand(food.id)"
              class="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
            >
              {{ expandedFood === food.id ? 'Less' : 'More' }} info
              <component :is="expandedFood === food.id ? ChevronUp : ChevronDown" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Expanded details -->
        <Transition name="expand">
          <div v-if="expandedFood === food.id" class="expand-panel">
            <!-- GI Bar -->
            <div class="mb-3">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-xs font-semibold text-stone-500 uppercase tracking-wide">Glycemic Index</span>
                <span class="text-xs font-bold" :class="glClass(food.glycemicLoad).text">{{ food.glycemicIndex }}</span>
              </div>
              <div class="progress-track">
                <div
                  :class="['gi-bar', glClass(food.glycemicLoad).bar]"
                  :style="`width:${Math.min((food.glycemicIndex / 100) * 100, 100)}%`"
                />
              </div>
              <div class="flex justify-between text-xs text-stone-300 mt-0.5">
                <span>Low</span><span>High</span>
              </div>
            </div>

            <!-- Fiber -->
            <div class="mb-3">
              <span class="text-xs font-semibold text-stone-500 uppercase tracking-wide">Dietary Fiber</span>
              <p class="text-sm text-stone-700 font-medium mt-0.5">{{ food.fiber }}g per serving</p>
            </div>

            <!-- Tags -->
            <div class="mb-3">
              <span class="text-xs font-semibold text-stone-500 uppercase tracking-wide">Tags</span>
              <div class="flex flex-wrap gap-1.5 mt-1.5">
                <span
                  v-for="tag in food.tags"
                  :key="tag"
                  class="text-xs px-2 py-0.5 rounded-full font-medium"
                  style="background:#f5f5f4;color:#78716c;border:1px solid #e7e5e4;"
                >
                  {{ tag.replace(/-/g, ' ') }}
                </span>
              </div>
            </div>

            <!-- Health note -->
            <div
              :class="['flex items-start gap-2 p-2.5 rounded-xl text-xs leading-relaxed', glClass(food.glycemicLoad).badge === 'badge-success' ? 'bg-emerald-50 text-emerald-800' : glClass(food.glycemicLoad).badge === 'badge-warning' ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-800']"
            >
              <Info class="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              {{ getHealthNote(food.glycemicLoad) }}
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="filteredFoods.length === 0"
      class="flex flex-col items-center py-16 rounded-2xl border-2 border-dashed border-stone-200"
      style="background:#fafaf9;"
    >
      <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style="background:#f5f5f4;">
        <Search class="w-7 h-7 text-stone-300" />
      </div>
      <p class="text-stone-700 font-semibold">No foods found</p>
      <p class="text-stone-400 text-sm mt-1">Try adjusting your search or filters</p>
      <button @click="clearFilters" class="btn-secondary mt-4">Clear all filters</button>
    </div>

    <!-- ── Educational footer ── -->
    <div class="card" style="background:#fafaf9;border-color:#e7e5e4;">
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style="background:#dbeafe;color:#1d4ed8;">
          <Info class="w-4 h-4" />
        </div>
        <div>
          <p class="text-sm font-semibold text-stone-700 mb-2">Understanding Glycemic Index (GI)</p>
          <p class="text-xs text-stone-500 mb-2 leading-relaxed">GI measures how quickly food raises blood sugar. Lower values mean slower, steadier glucose rise — better for diabetes management.</p>
          <div class="flex flex-wrap gap-3">
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full bg-emerald-400" />
              <span class="text-xs text-stone-500"><span class="font-semibold text-emerald-700">Low GI (≤10)</span> — Minimal impact</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full bg-amber-400" />
              <span class="text-xs text-stone-500"><span class="font-semibold text-amber-700">Medium GI (11–19)</span> — Moderate, watch portions</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-2 h-2 rounded-full bg-red-400" />
              <span class="text-xs text-stone-500"><span class="font-semibold text-red-700">High GI (≥20)</span> — Significant, consume sparingly</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Stat chips in header */
.stat-chip {
  border-radius: 14px;
  padding: 0.875rem 1rem;
  text-align: center;
  border: 1px solid;
}

.stat-chip--green { background: #f0fdf4; border-color: rgba(34,197,94,0.2); color: #15803d; }
.stat-chip--amber { background: #fffbeb; border-color: rgba(245,158,11,0.2); color: #b45309; }
.stat-chip--red   { background: #fef2f2; border-color: rgba(239,68,68,0.15); color: #b91c1c; }

/* Food cards */
.food-card {
  background: white;
  border: 1.5px solid #e7e5e4;
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.2s ease;
}

.food-card:hover {
  border-color: #14b8a6;
  box-shadow: 0 4px 16px rgba(20,184,166,0.1);
}

.food-card--expanded {
  border-color: #14b8a6;
  box-shadow: 0 4px 20px rgba(20,184,166,0.12);
}

/* Expand panel */
.expand-panel {
  padding: 0 1rem 1rem;
  border-top: 1px solid #f5f5f4;
  margin-top: 0;
  padding-top: 1rem;
  background: #fafaf9;
}

/* GI bar variants */
.gi-bar {
  height: 8px;
  border-radius: 999px;
  transition: width 0.6s ease;
}

.gi-bar--green { background: linear-gradient(90deg, #22c55e, #16a34a); }
.gi-bar--amber { background: linear-gradient(90deg, #f59e0b, #d97706); }
.gi-bar--red   { background: linear-gradient(90deg, #ef4444, #dc2626); }
.gi-bar--teal  { background: linear-gradient(90deg, #14b8a6, #0d9488); }

/* Expand transition */
.expand-enter-active, .expand-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to, .expand-leave-from {
  max-height: 400px;
}
</style>
