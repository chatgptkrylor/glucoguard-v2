<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Line, 
  Doughnut
} from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle,
  Info,
  AlertTriangle,
  Loader2
} from 'lucide-vue-next'
import { analyzeGlucoseData } from '../ai/glucoseAnalysis'
import { generateAlerts } from '../ai/predictiveAlerts'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Loading states
const isLoading = ref(true)
const selectedPeriod = ref<'24h' | '7d' | '30d'>('24h')

// Load data with delay to simulate real API
onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
})

// Handle period change
function changePeriod(period: '24h' | '7d' | '30d') {
  selectedPeriod.value = period
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 800)
}

const readings = ref([
  { value: 120, timestamp: new Date('2026-03-19T08:00:00'), mealContext: 'fasting' as const },
  { value: 145, timestamp: new Date('2026-03-19T10:30:00'), mealContext: 'after_meal' as const },
  { value: 130, timestamp: new Date('2026-03-19T13:00:00'), mealContext: 'before_meal' as const },
  { value: 160, timestamp: new Date('2026-03-19T14:30:00'), mealContext: 'after_meal' as const },
  { value: 125, timestamp: new Date('2026-03-19T18:00:00'), mealContext: 'before_meal' as const },
  { value: 150, timestamp: new Date('2026-03-19T20:00:00'), mealContext: 'after_meal' as const },
  { value: 135, timestamp: new Date('2026-03-19T22:00:00'), mealContext: 'bedtime' as const },
])

const stats = computed(() => analyzeGlucoseData(readings.value))
const alerts = computed(() => generateAlerts(readings.value, 142, 2))

// Chart data
const glucoseChartData = computed(() => ({
  labels: ['8 AM', '10 AM', '1 PM', '2:30 PM', '6 PM', '8 PM', '10 PM'],
  datasets: [{
    label: 'Glucose (mg/dL)',
    data: readings.value.map(r => r.value),
    borderColor: 'rgb(6, 182, 212)',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    fill: true,
    tension: 0.4,
    pointRadius: 6,
    pointHoverRadius: 8,
    pointBackgroundColor: 'rgb(6, 182, 212)',
    pointBorderColor: 'white',
    pointBorderWidth: 2,
  }]
}))

const glucoseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index'
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: 'rgba(6, 182, 212, 0.3)',
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (context: any) => `Glucose: ${context.parsed.y} mg/dL`
      }
    }
  },
  scales: {
    y: {
      min: 50,
      max: 200,
      grid: { color: 'rgba(255,255,255,0.1)' },
      ticks: { 
        color: 'rgba(255,255,255,0.7)',
        callback: (value: number) => value + ' mg/dL'
      }
    },
    x: {
      grid: { display: false },
      ticks: { color: 'rgba(255,255,255,0.7)' }
    }
  }
}

// Time in Range chart
const tirChartData = computed(() => ({
  labels: ['In Range\n(70-180)', 'Below\n(<70)', 'Above\n(>180)'],
  datasets: [{
    data: [stats.value.timeInRange.inRange, stats.value.timeInRange.low, stats.value.timeInRange.high],
    backgroundColor: [
      'rgb(34, 197, 94)',
      'rgb(239, 68, 68)',
      'rgb(249, 115, 22)'
    ],
    borderWidth: 0,
    hoverOffset: 4
  }]
}))

const tirChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { 
        color: 'white', 
        padding: 20,
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (context: any) => {
          const label = context.label?.split('\n')[0] || ''
          const value = context.parsed
          const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
          const percentage = ((value / total) * 100).toFixed(1)
          return `${label}: ${value} hours (${percentage}%)`
        }
      }
    }
  },
  cutout: '65%'
}

// Stat cards with loading state
const statCards = computed(() => [
  {
    title: 'Current Glucose',
    value: isLoading.value ? '--' : 142,
    unit: 'mg/dL',
    trend: 'stable' as const,
    icon: Activity,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/20',
    description: 'Last updated 5 min ago'
  },
  {
    title: 'Time in Range',
    value: isLoading.value ? '--' : Math.round(stats.value.timeInRange.percentage),
    unit: '%',
    trend: 'up' as const,
    icon: CheckCircle,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/20',
    description: 'Target: 70%+'
  },
  {
    title: '7-Day Average',
    value: isLoading.value ? '--' : Math.round(stats.value.average),
    unit: 'mg/dL',
    trend: 'down' as const,
    icon: TrendingUp,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    description: '-8% from last week'
  },
  {
    title: 'Est. HbA1c',
    value: isLoading.value ? '--' : stats.value.estimatedHbA1c.toFixed(1),
    unit: '%',
    trend: 'stable' as const,
    icon: Info,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    description: 'Target: <7%'
  }
])

const predictions = ref([
  {
    id: '1',
    type: 'hypoglycemia',
    probability: 35,
    timeframe: 'Next 4 hours',
    recommendations: [
      'Have a small snack before bedtime',
      'Monitor glucose at 2 AM'
    ]
  },
  {
    id: '2',
    type: 'dawn_phenomenon',
    probability: 78,
    timeframe: 'Tomorrow morning',
    recommendations: [
      'Take long-acting insulin at bedtime',
      'Light morning exercise may help'
    ]
  },
  {
    id: '3',
    type: 'hyperglycemia',
    probability: 25,
    timeframe: 'After next meal',
    recommendations: [
      'Choose low-GI foods for lunch',
      'Take post-meal walk'
    ]
  }
])

function getPredictionColor(probability: number): string {
  if (probability > 70) return 'bg-red-500'
  if (probability > 40) return 'bg-amber-500'
  return 'bg-emerald-500'
}

function getPredictionBg(probability: number): string {
  if (probability > 70) return 'bg-red-500/10 border-red-500/30'
  if (probability > 40) return 'bg-amber-500/10 border-amber-500/30'
  return 'bg-emerald-500/10 border-emerald-500/30'
}

function getPredictionText(probability: number): string {
  if (probability > 70) return 'text-red-400'
  if (probability > 40) return 'text-amber-400'
  return 'text-emerald-400'
}

function getPredictionLabel(probability: number): string {
  if (probability > 70) return 'High Risk'
  if (probability > 40) return 'Medium Risk'
  return 'Low Risk'
}
</script>

<template>
  <div class="space-y-6 md:space-y-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <Loader2 class="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
        <p class="text-slate-300">Loading your health data...</p>
        <p class="text-slate-500 text-sm mt-2">Analyzing glucose patterns</p>
      </div>
    </div>

    <div v-else class="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <!-- Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div
          v-for="stat in statCards"
          :key="stat.title"
          class="bg-slate-800 rounded-xl md:rounded-2xl p-4 md:p-5 border border-slate-700 hover:border-slate-600 transition-all shadow-lg shadow-black/20"
        >
          <div class="flex items-start justify-between">
            <div class="min-w-0">
              <p class="text-slate-400 text-xs md:text-sm mb-1 truncate">{{ stat.title }}</p>
              <div class="flex items-baseline gap-1 md:gap-2">
                <span :class="`text-2xl md:text-3xl font-bold ${stat.color}`">{{ stat.value }}</span>
                <span class="text-slate-500 text-xs md:text-sm">{{ stat.unit }}</span>
              </div>
              <p class="text-slate-500 text-xs mt-1 hidden md:block">{{ stat.description }}</p>
            </div>
            
            <div :class="`p-2 md:p-3 rounded-lg md:rounded-xl ${stat.bgColor} flex-shrink-0`">
              <component :is="stat.icon" :size="20" :class="stat.color" />
            </div>
          </div>
          
          <div class="mt-3 md:mt-4 flex items-center gap-2">
            <TrendingUp v-if="stat.trend === 'up'" :size="14" class="text-red-400" />
            <TrendingDown v-else-if="stat.trend === 'down'" :size="14" class="text-emerald-400" />
            <Activity v-else :size="14" class="text-blue-400" />
            
            <span :class="`text-xs ${
              stat.trend === 'up' ? 'text-red-400' : 
              stat.trend === 'down' ? 'text-emerald-400' : 
              'text-blue-400'
            }`">
              {{ stat.trend === 'up' ? '↑ Rising' : 
                 stat.trend === 'down' ? '↓ Improving' : 
                 '→ Stable' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <!-- Glucose Trend Chart -->
        <div class="lg:col-span-2 bg-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-700 shadow-lg shadow-black/20">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
            <div>
              <h3 class="text-base md:text-lg font-semibold text-white">Glucose Trends</h3>
              <p class="text-slate-400 text-xs md:text-sm">Track your glucose over time</p>
            </div>
            <div class="flex gap-2">
              <button 
                v-for="period in ['24h', '7d', '30d']" 
                :key="period"
                @click="changePeriod(period as '24h' | '7d' | '30d')"
                :disabled="isLoading"
                :class="[
                  'px-3 py-1.5 text-sm rounded-lg transition-all font-medium',
                  selectedPeriod === period 
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' 
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                ]"
              >
                {{ period }}
              </button>
            </div>
          </div>
          
          <div class="h-64 md:h-80">
            <Line :data="glucoseChartData" :options="glucoseChartOptions" />
          </div>
          
          <!-- Chart Legend -->
          <div class="mt-4 flex flex-wrap items-center gap-4 text-xs md:text-sm">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span class="text-slate-400">Target Range (70-180)</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-red-500"></span>
              <span class="text-slate-400">Hypo (<70) / Hyper (>180)</span>
            </div>
          </div>
        </div>

        <!-- Time in Range -->
        <div class="bg-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-700 shadow-lg shadow-black/20">
          <div class="mb-4">
            <h3 class="text-base md:text-lg font-semibold text-white">Time in Range</h3>
            <p class="text-slate-400 text-xs md:text-sm">Hours spent in each zone</p>
          </div>
          
          <div class="h-56 md:h-64">
            <Doughnut :data="tirChartData" :options="tirChartOptions" />
          </div>
          
          <div class="mt-4 p-3 md:p-4 bg-emerald-500/10 rounded-lg md:rounded-xl border border-emerald-500/20">
            <div class="flex items-center gap-2 mb-1">
              <CheckCircle class="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />
              <span class="text-emerald-400 font-medium text-sm">Doing Great!</span>
            </div>
            <p class="text-slate-400 text-xs">Target is 70%+ time in range</p>
          </div>
        </div>
      </div>

      <!-- AI Predictions -->
      <div class="bg-slate-800 rounded-xl md:rounded-2xl p-4 md:p-6 border border-slate-700 shadow-lg shadow-black/20">
        <div class="flex items-center gap-3 mb-4 md:mb-6">
          <div class="p-2 bg-purple-500/20 rounded-lg">
            <AlertTriangle class="text-purple-400" :size="20" />
          </div>
          <div>
            <h3 class="text-base md:text-lg font-semibold text-white">AI Health Insights</h3>
            <p class="text-slate-400 text-xs md:text-sm">Predictions based on your patterns</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <div 
            v-for="pred in predictions"
            :key="pred.id"
            :class="`p-4 md:p-5 rounded-lg md:rounded-xl border ${getPredictionBg(pred.probability)} transition-all hover:scale-[1.02]`"
          >
            <div class="flex items-center justify-between mb-3">
              <span class="font-medium text-white text-sm md:text-base capitalize">{{ pred.type.replace('_', ' ') }}</span>
              <span :class="`text-xs md:text-sm font-bold px-2 py-1 rounded-full bg-slate-900/50 ${getPredictionText(pred.probability)}`">
                {{ getPredictionLabel(pred.probability) }}
              </span>
            </div>
            
            <div class="mb-3">
              <div class="flex items-center justify-between text-xs md:text-sm mb-1">
                <span class="text-slate-400">Risk Level</span>
                <span :class="`font-bold ${getPredictionText(pred.probability)}`">{{ pred.probability }}%</span>
              </div>
              <div class="w-full bg-slate-700 rounded-full h-2">
                <div 
                  :class="`h-2 rounded-full transition-all ${getPredictionColor(pred.probability)}`"
                  :style="{ width: `${pred.probability}%` }"
                />
              </div>
            </div>
            
            <p class="text-slate-400 text-xs md:text-sm mb-3">{{ pred.timeframe }}</p>
            
            <div class="space-y-2">
              <div 
                v-for="(rec, idx) in pred.recommendations" 
                :key="idx" 
                class="flex items-start gap-2 text-xs md:text-sm text-slate-300"
              >
                <Info :size="14" class="text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>{{ rec }}</span>
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
  animation: fade-in 0.5s ease-out;
}
</style>
