<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Search, 
  Filter,
  Leaf,
  Flame,
  Wheat,
  Droplets,
  Info,
  MapPin,
  Tag,
  ChevronDown,
  ChevronUp,
  Heart
} from 'lucide-vue-next'
import { indianFoods, FoodItem } from '../data/indianFoods'

const searchQuery = ref('')
const selectedRegion = ref<'all' | 'north' | 'south' | 'east' | 'west' | 'pan-india'>('all')
const selectedCategory = ref<'all' | 'grain' | 'pulse' | 'vegetable' | 'fruit' | 'dairy' | 'meat' | 'snack' | 'beverage'>('all')
const selectedGlycemicLoad = ref<'all' | 'low' | 'medium' | 'high'>('all')
const expandedFood = ref<string | null>(null)

const categories = [
  { id: 'all', label: 'All Categories', icon: Tag },
  { id: 'grain', label: 'Grains', icon: Wheat },
  { id: 'pulse', label: 'Pulses', icon: Leaf },
  { id: 'vegetable', label: 'Vegetables', icon: Leaf },
  { id: 'fruit', label: 'Fruits', icon: Leaf },
  { id: 'dairy', label: 'Dairy', icon: Droplets },
  { id: 'meat', label: 'Meat & Fish', icon: Flame },
  { id: 'snack', label: 'Snacks', icon: Flame },
  { id: 'beverage', label: 'Beverages', icon: Droplets },
]

const regions = [
  { id: 'all', label: 'All Regions' },
  { id: 'north', label: 'North Indian' },
  { id: 'south', label: 'South Indian' },
  { id: 'east', label: 'East Indian' },
  { id: 'west', label: 'West Indian' },
  { id: 'pan-india', label: 'Pan-Indian' },
]

const filteredFoods = computed(() => {
  return indianFoods.filter(food => {
    const matchesSearch = 
      food.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      food.hindiName.includes(searchQuery.value) ||
      food.tags.some(tag => tag.toLowerCase().includes(searchQuery.value.toLowerCase()))
    
    const matchesRegion = selectedRegion.value === 'all' || food.region === selectedRegion.value
    const matchesCategory = selectedCategory.value === 'all' || food.category === selectedCategory.value
    const matchesGI = selectedGlycemicLoad.value === 'all' || food.glycemicLoad === selectedGlycemicLoad.value
    
    return matchesSearch && matchesRegion && matchesCategory && matchesGI
  })
})

const stats = computed(() => {
  const lowGI = indianFoods.filter(f => f.glycemicLoad === 'low').length
  const mediumGI = indianFoods.filter(f => f.glycemicLoad === 'medium').length
  const highGI = indianFoods.filter(f => f.glycemicLoad === 'high').length
  
  return { lowGI, mediumGI, highGI, total: indianFoods.length }
})

function getCategoryIcon(category: string) {
  const cat = categories.find(c => c.id === category)
  return cat?.icon || Tag
}

function getGlycemicLoadColor(load: string): string {
  switch (load) {
    case 'low': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30'
    case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
    case 'high': return 'text-red-400 bg-red-400/10 border-red-400/30'
    default: return 'text-slate-400 bg-slate-400/10'
  }
}

function getRegionFlag(region: string): string {
  switch (region) {
    case 'north': return '🇮🇳'
    case 'south': return '🌴'
    case 'east': return '🐟'
    case 'west': return '🏜️'
    default: return '🇮🇳'
  }
}

function toggleExpand(id: string) {
  expandedFood.value = expandedFood.value === id ? null : id
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
          <Wheat class="text-white" :size="24" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-white">Indian Food Database</h2>
          <p class="text-slate-400">{{ stats.total }}+ foods with glycemic index and nutrition data</p>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 mt-4">
        <div class="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/30 text-center">
          <div class="text-2xl font-bold text-emerald-400">{{ stats.lowGI }}</div>
          <div class="text-xs text-emerald-300">Low GI Foods</div>
        </div>
        <div class="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30 text-center">
          <div class="text-2xl font-bold text-yellow-400">{{ stats.mediumGI }}</div>
          <div class="text-xs text-yellow-300">Medium GI Foods</div>
        </div>
        <div class="p-3 bg-red-500/10 rounded-lg border border-red-500/30 text-center">
          <div class="text-2xl font-bold text-red-400">{{ stats.highGI }}</div>
          <div class="text-xs text-red-300">High GI Foods</div>
        </div>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="bg-slate-800 rounded-xl p-4 border border-slate-700">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Search -->
        <div class="flex-1 relative">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search foods (English or Hindi)..."
            class="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <!-- Region Filter -->
        <select 
          v-model="selectedRegion" 
          class="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white min-w-[140px]"
        >
          <option v-for="region in regions" :key="region.id" :value="region.id">
            {{ region.label }}
          </option>
        </select>

        <!-- Category Filter -->
        <select 
          v-model="selectedCategory" 
          class="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white min-w-[140px]"
        >
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.label }}
          </option>
        </select>

        <!-- GI Filter -->
        <select 
          v-model="selectedGlycemicLoad" 
          class="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white min-w-[140px]"
        >
          <option value="all">All GI Levels</option>
          <option value="low">Low GI (≤10)</option>
          <option value="medium">Medium GI (11-19)</option>
          <option value="high">High GI (≥20)</option>
        </select>
      </div>

      <!-- Results Count -->
      <div class="mt-4 flex items-center justify-between">
        <span class="text-slate-400">
          Showing {{ filteredFoods.length }} of {{ stats.total }} foods
        </span>
        <button 
          v-if="searchQuery || selectedRegion !== 'all' || selectedCategory !== 'all' || selectedGlycemicLoad !== 'all'"
          @click="searchQuery = ''; selectedRegion = 'all'; selectedCategory = 'all'; selectedGlycemicLoad = 'all'"
          class="text-sm text-cyan-400 hover:text-cyan-300"
        >
          Clear filters
        </button>
      </div>
    </div>

    <!-- Food Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="food in filteredFoods" 
        :key="food.id"
        :class="`bg-slate-800 rounded-xl border transition-all overflow-hidden ${expandedFood === food.id ? 'border-cyan-500 ring-2 ring-cyan-500/20' : 'border-slate-700 hover:border-slate-600'}`"
      >
        <div class="p-4">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h3 class="font-semibold text-white">{{ food.name }}</h3>
              <p class="text-sm text-slate-500">{{ food.hindiName }}</p>
            </div>
            <span :class="`text-xs px-2 py-1 rounded-full font-medium ${getGlycemicLoadColor(food.glycemicLoad)}`">
              {{ food.glycemicLoad }} GI
            </span>
          </div>

          <div class="flex items-center gap-2 mb-3">
            <span class="text-lg">{{ getRegionFlag(food.region) }}</span>
            <span class="text-xs text-slate-400 capitalize">{{ food.region.replace('-', ' ') }}</span>
            <span class="text-slate-600">•</span>
            <component :is="getCategoryIcon(food.category)" class="w-3 h-3 text-slate-400" />
            <span class="text-xs text-slate-400 capitalize">{{ food.category }}</span>
          </div>

          <div class="grid grid-cols-4 gap-2 py-3 border-t border-slate-700">
            <div class="text-center">
              <Flame class="w-4 h-4 text-orange-400 mx-auto mb-1" />
              <span class="text-xs text-slate-400">{{ food.calories }}</span>
            </div>
            <div class="text-center">
              <Wheat class="w-4 h-4 text-yellow-400 mx-auto mb-1" />
              <span class="text-xs text-slate-400">{{ food.carbs }}g</span>
            </div>
            <div class="text-center">
              <Leaf class="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span class="text-xs text-slate-400">{{ food.protein }}g</span>
            </div>
            <div class="text-center">
              <Droplets class="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <span class="text-xs text-slate-400">{{ food.fat }}g</span>
            </div>
          </div>

          <div class="flex items-center justify-between pt-3">
            <span class="text-xs text-slate-500">{{ food.servingSize }}</span>
            <button 
              @click="toggleExpand(food.id)"
              class="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300"
            >
              {{ expandedFood === food.id ? 'Less' : 'More' }} info
              <component :is="expandedFood === food.id ? ChevronUp : ChevronDown" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Expanded Details -->
        <div v-if="expandedFood === food.id" class="px-4 pb-4 bg-slate-700/30">
          <div class="pt-3 border-t border-slate-700 space-y-3">
            <div>
              <span class="text-xs text-slate-500 uppercase tracking-wider">Glycemic Index</span>
              <div class="flex items-center gap-2 mt-1">
                <div class="flex-1 bg-slate-700 rounded-full h-2">
                  <div 
                    class="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-red-400"
                    :style="{ width: `${(food.glycemicIndex / 100) * 100}%` }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-white">{{ food.glycemicIndex }}</span>
              </div>
            </div>

            <div>
              <span class="text-xs text-slate-500 uppercase tracking-wider">Fiber</span>
              <p class="text-sm text-white mt-1">{{ food.fiber }}g per serving</p>
            </div>

            <div>
              <span class="text-xs text-slate-500 uppercase tracking-wider">Tags</span>
              <div class="flex flex-wrap gap-2 mt-1">
                <span 
                  v-for="tag in food.tags" 
                  :key="tag"
                  class="text-xs px-2 py-1 bg-slate-700 rounded-full text-slate-300"
                >
                  {{ tag.replace('-', ' ') }}
                </span>
              </div>
            </div>

            <div :class="`p-3 rounded-lg ${getGlycemicLoadColor(food.glycemicLoad)}`">
              <div class="flex items-center gap-2">
                <Info class="w-4 h-4" />
                <span class="text-sm font-medium">
                  {{ food.glycemicLoad === 'low' ? 'Good for diabetes' : 
                     food.glycemicLoad === 'medium' ? 'Consume in moderation' : 
                     'Limit consumption' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredFoods.length === 0" class="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
      <Search class="w-12 h-12 text-slate-500 mx-auto mb-3" />
      <p class="text-white font-medium">No foods found</p>
      <p class="text-sm text-slate-400 mt-1">Try adjusting your filters or search query</p>
    </div>

    <!-- Footer Note -->
    <div class="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
      <div class="flex items-start gap-3">
        <Info class="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
        <div class="text-sm text-slate-400">
          <p class="mb-2"><strong>Glycemic Index (GI)</strong> measures how quickly a food raises blood sugar. Lower is better for diabetes management.</p>
          <ul class="list-disc list-inside space-y-1 text-xs">
            <li><span class="text-emerald-400">Low GI (≤10)</span>: Minimal impact on blood sugar</li>
            <li><span class="text-yellow-400">Medium GI (11-19)</span>: Moderate impact, portion control recommended</li>
            <li><span class="text-red-400">High GI (≥20)</span>: Significant impact, consume sparingly</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
