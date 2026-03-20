<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Line, 
  Doughnut,
  Bar
} from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
  AlertTriangle
} from 'lucide-vue-next'
import { indianFoods } from '../data/indianFoods'
import { analyzeGlucoseData, getPeriodStats } from '../ai/glucoseAnalysis'
import { generateAlerts } from '../ai/predictiveAlerts'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Mock glucose readings
const readings = ref([
  { value: 120, timestamp: new Date('2026-03-19T08:00:00'), mealContext: 'fasting' },
  { value: 145, timestamp: new Date('2026-03-19T10:30:00'), mealContext: 'after_meal' },
  { value: 130, timestamp: new Date('2026-03-19T13:00:00'), mealContext: 'before_meal' },
  { value: 160, timestamp: new Date('2026-03-19T14:30:00'), mealContext: 'after_meal' },
  { value: 125, timestamp: new Date('2026-03-19T18:00:00'), mealContext: 'before_meal' },
  { value: 150, timestamp: new Date('2026-03-19T20:00:00'), mealContext: 'after_meal' },
  { value: 135, timestamp: new Date('2026-03-19T22:00:00'), mealContext: 'bedtime' },
])

const stats = computed(() => analyzeGlucoseData(readings.value))
const alerts = computed(() => generateAlerts(readings.value, 142, 2))

// Glucose trend chart data
const glucoseChartData = computed(() => ({
  labels: ['8 AM', '10 AM', '1 PM', '2:30 PM', '6 PM', '8 PM', '10 PM'],
  datasets: [{
    label: 'Glucose (mg/dL)',
    data: readings.value.map(r => r.value),
    borderColor: 'rgb(6, 182, 212)',
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    fill: true,
    tension: 0.4,
    pointRadius: 4,
    pointBackgroundColor: 'rgb(6, 182, 212)',
    pointBorderColor: 'white',
    pointBorderWidth: 2,
  }]
}))

const glucoseChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: '24-Hour Glucose Trend',
      color: 'white',
      font: { size: 14, weight: 'bold' }
    }
  },
  scales: {
    y: {
      min: 50,
      max: 200,
      grid: { color: 'rgba(255,255,255,0.1)' },
      ticks: { color: 'rgba(255,255,255,0.7)' }
    },
    x: {
      grid: { display: false },
      ticks: { color: 'rgba(255,255,255,0.7)' }
    }
  }
}

// Time in Range chart
const tirChartData = computed(() => ({
  labels: ['In Range (70-180)', 'Below (<70)', 'Above (>180)'],
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
      labels: { color: 'white', padding: 20 }
    }
  },
  cutout: '60%'
}

interface StatCard {
  title: string
  value: string | number
  unit: string
  trend: 'up' | 'down' | 'stable'
  icon: any
  color: string
}

const statCards = computed<StatCard[]>(() => [
  {
    title: 'Current Glucose',
    value: 142,
    unit: 'mg/dL',
    trend: 'stable',
    icon: Activity,
    color: 'text-cyan-400'
  },
  {
    title: 'Time in Range',
    value: stats.value.timeInRange.percentage,
    unit: '%',
    trend: 'up',
    icon: CheckCircle,
    color: 'text-green-400'
  },
  {
    title: 'Avg Glucose (7d)',
    value: stats.value.average,
    unit: 'mg/dL',
    trend: 'down',
    icon: TrendingUp,
    color: 'text-emerald-400'
  },
  {
    title: 'Est. HbA1c',
    value: stats.value.estimatedHbA1c.toFixed(1),
    unit: '%',
    trend: 'stable',
    icon: Info,
    color: 'text-purple-400'
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
  if (probability > 40) return 'bg-yellow-500'
  return 'bg-green-500'
}

function getPredictionBg(probability: number): string {
  if (probability > 70) return 'bg-red-500/10 border-red-500/30'
  if (probability > 40) return 'bg-yellow-500/10 border-yellow-500/30'
  return 'bg-green-500/10 border-green-500/30'
}

function getPredictionText(probability: number): string {
  if (probability > 70) return 'text-red-400'
  if (probability > 40) return 'text-yellow-400'
  return 'text-green-400'
}
</script>

<template>
  <div class="space-y-6">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="stat in statCards"
        :key="stat.title"
        class="bg-slate-800 rounded-2xl p-5 border border-slate-700 hover:border-slate-600 transition-all"
      >
        <div class="flex items-start justify-between">
          <div>
            <p class="text-slate-400 text-sm mb-1">{{ stat.title }}</p>
            <div class="flex items-baseline gap-2">
              <span :class="`text-3xl font-bold ${stat.color}`">{{ stat.value }}</span>
              <span class="text-slate-500 text-sm">{{ stat.unit }}</span>
            </div>
          </div>
          
          <div :class="`p-3 rounded-xl ${stat.color.replace('text-', 'bg-').replace('400', '500/20')}`">
            <component :is="stat.icon" :size="24" :class="stat.color" />
          </div>
        </div>
        
        <div class="mt-4 flex items-center gap-2">
          <TrendingUp v-if="stat.trend === 'up'" :size="16" class="text-red-400" />
          <TrendingDown v-else-if="stat.trend === 'down'" :size="16" class="text-green-400" />
          <Activity v-else :size="16" class="text-blue-400" />
          
          <span :class="`text-sm ${
            stat.trend === 'up' ? 'text-red-400' : 
            stat.trend === 'down' ? 'text-green-400' : 
            'text-blue-400'
          }`">
            {{ stat.trend === 'up' ? '+12% vs last week' : 
               stat.trend === 'down' ? '-8% vs last week' : 
               'Stable' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Glucose Trend Chart -->
      <div class="lg:col-span-2 bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-white">Glucose Trends</h3>
          <div class="flex gap-2">
            <button class="px-3 py-1 text-sm rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600">24h</button>
            <button class="px-3 py-1 text-sm rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600">7d</button>
            <button class="px-3 py-1 text-sm rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600">30d</button>
          </div>
        </div>
        <div class="h-80">
          <Line :data="glucoseChartData" :options="glucoseChartOptions" />
        </div>
      </div>

      <!-- Time in Range -->
      <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h3 class="text-lg font-semibold text-white mb-6">Time in Range</h3>
        <div class="h-64">
          <Doughnut :data="tirChartData" :options="tirChartOptions" />
        </div>
        <div class="mt-4 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
          <p class="text-green-400 font-medium">Target: 70%+</p>
          <p class="text-slate-400 text-sm mt-1">You're doing great! Keep it up.</p>
        </div>
      </div>
    </div>

    <!-- AI Predictions -->
    <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 bg-purple-500/20 rounded-lg">
          <AlertTriangle class="text-purple-400" :size="24" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-white">AI Health Insights</h3>
          <p class="text-slate-400 text-sm">Predictions based on your patterns</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          v-for="pred in predictions"
          :key="pred.id"
          :class="`p-4 rounded-xl border ${getPredictionBg(pred.probability)}`"
        >
          <div class="flex items-center justify-between mb-3">
            <span class="font-medium text-white capitalize">{{ pred.type.replace('_', ' ') }}</span>
            <span :class="`text-sm font-bold ${getPredictionText(pred.probability)}`">{{ pred.probability }}% Risk</span>
          </div>
          
          <div class="w-full bg-slate-700 rounded-full h-2 mb-3">
            <div 
              :class="`h-2 rounded-full ${getPredictionColor(pred.probability)}`"
              :style="{ width: `${pred.probability}%` }"
            />
          </div>
          
          <p class="text-slate-400 text-sm">{{ pred.timeframe }}</p>
          
          <div class="mt-3 space-y-1">
            <div v-for="(rec, idx) in pred.recommendations.slice(0, 2)" :key="idx" class="flex items-center gap-2 text-sm text-slate-300">
              <Info :size="14" class="text-cyan-400 flex-shrink-0" />
              <span>{{ rec }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
