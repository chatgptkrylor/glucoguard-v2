<script setup lang="ts">
import { ref } from 'vue'
import { Line, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Target,
  Zap,
  Info,
  CheckCircle,
  AlertTriangle,
  Clock,
} from 'lucide-vue-next'
import { mockGlucoseData, mockHealthStats } from '../data/mockData'

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Tooltip, Legend, Filler, ArcElement
)

const stats = mockHealthStats
const currentGlucose = mockGlucoseData[mockGlucoseData.length - 1].value
const prevGlucose = mockGlucoseData[mockGlucoseData.length - 2].value
const glucoseDiff = currentGlucose - prevGlucose

const trend = glucoseDiff > 5 ? 'rising' : glucoseDiff < -5 ? 'falling' : 'stable'
const trendLabel = trend === 'rising' ? 'Rising' : trend === 'falling' ? 'Falling' : 'Stable'

function glucoseStatus(val: number): { label: string; colorClass: string } {
  if (val < 70) return { label: 'Low', colorClass: 'text-red-300' }
  if (val <= 140) return { label: 'In Range', colorClass: 'text-teal-200' }
  if (val <= 180) return { label: 'Slightly High', colorClass: 'text-amber-200' }
  return { label: 'High', colorClass: 'text-red-300' }
}

const status = glucoseStatus(currentGlucose)

// Glucose line chart
const lineChartData: ChartData<'line'> = {
  labels: mockGlucoseData.map(d => d.time),
  datasets: [
    {
      label: 'Glucose',
      data: mockGlucoseData.map(d => d.value),
      borderColor: '#14b8a6',
      backgroundColor: 'rgba(20,184,166,0.08)',
      borderWidth: 2.5,
      pointRadius: 3,
      pointHoverRadius: 5,
      pointBackgroundColor: '#14b8a6',
      pointBorderColor: '#fff',
      pointBorderWidth: 1.5,
      tension: 0.4,
      fill: true,
    },
    {
      label: 'Target Max',
      data: mockGlucoseData.map(() => 180),
      borderColor: 'rgba(245,158,11,0.4)',
      borderWidth: 1.5,
      borderDash: [4, 4],
      pointRadius: 0,
      fill: false,
      tension: 0,
    },
    {
      label: 'Target Min',
      data: mockGlucoseData.map(() => 70),
      borderColor: 'rgba(239,68,68,0.4)',
      borderWidth: 1.5,
      borderDash: [4, 4],
      pointRadius: 0,
      fill: false,
      tension: 0,
    },
  ],
}

const lineChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1c1917',
      titleColor: '#e7e5e4',
      bodyColor: '#a8a29e',
      padding: 10,
      cornerRadius: 8,
    },
  },
  scales: {
    y: {
      min: 50,
      max: 260,
      grid: { color: 'rgba(0,0,0,0.04)' },
      ticks: { font: { size: 11 }, color: '#a8a29e', stepSize: 50 },
      border: { display: false },
    },
    x: {
      grid: { display: false },
      ticks: { font: { size: 10 }, color: '#a8a29e', maxRotation: 0, maxTicksLimit: 8 },
      border: { display: false },
    },
  },
}

// TIR Doughnut
const lowPct = 5
const highPct = 100 - stats.timeInRange - lowPct

const tirChartData: ChartData<'doughnut'> = {
  labels: ['In Range', 'High', 'Low'],
  datasets: [
    {
      data: [stats.timeInRange, highPct, lowPct],
      backgroundColor: ['#14b8a6', '#f59e0b', '#ef4444'],
      borderWidth: 0,
      hoverOffset: 4,
    },
  ],
}

const tirChartOptions: ChartOptions<'doughnut'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  cutout: '72%',
}

const period = ref<'day' | 'week' | 'month'>('day')

const insights = [
  { type: 'warning', icon: '🌅', title: 'Dawn Phenomenon', text: 'Morning glucose consistently spikes 4–8 AM. Consider discussing bedtime insulin timing with Dr. Rais.' },
  { type: 'success', icon: '✅', title: 'Improving Trend', text: 'Post-meal glucose 15% better this week vs last. Low-GI food choices are working.' },
  { type: 'info', icon: '💊', title: 'Medication Reminder', text: 'Take Metformin 500mg with dinner. Consistent timing improves effectiveness.' },
  { type: 'info', icon: '🚶', title: 'Activity Suggestion', text: 'A 15-min evening walk can lower your glucose by ~20 mg/dL. Best time: 30 min after dinner.' },
]

const recentReadings = [
  { time: '10:00 PM', value: 130, context: 'After Dinner' },
  { time: '8:00 PM', value: 155, context: 'After Snack' },
  { time: '6:00 PM', value: 175, context: 'After Lunch' },
  { time: '2:00 PM', value: 165, context: 'Post Meal' },
  { time: '10:30 AM', value: 145, context: 'After Breakfast' },
]
</script>

<template>
  <div class="px-4 py-5 max-w-4xl mx-auto space-y-4 lg:px-6 lg:py-6">

    <!-- Header -->
    <div class="flex items-start justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Good evening, Rajesh</h2>
        <p class="text-sm text-gray-500 mt-0.5">Thursday, March 20, 2026</p>
      </div>
      <div class="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm flex-shrink-0">
        <button
          v-for="p in ['day', 'week', 'month'] as const"
          :key="p"
          @click="period = p"
          class="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors min-h-[32px]"
          :class="period === p ? 'bg-teal-500 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'"
        >{{ p.charAt(0).toUpperCase() + p.slice(1) }}</button>
      </div>
    </div>

    <!-- Current Glucose Hero Card -->
    <div class="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
      <div class="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div class="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div class="relative z-10 flex items-start justify-between mb-4">
        <div>
          <p class="text-sm text-teal-100 font-medium mb-1">Current Glucose</p>
          <div class="flex items-end gap-2">
            <span class="text-5xl font-extrabold tracking-tight leading-none">{{ currentGlucose }}</span>
            <span class="text-lg text-teal-200 mb-1">mg/dL</span>
          </div>
          <div class="flex items-center gap-2 mt-2">
            <span class="text-xs bg-white/15 rounded-full px-2.5 py-0.5 font-medium" :class="status.colorClass">{{ status.label }}</span>
            <component :is="trend === 'rising' ? TrendingUp : trend === 'falling' ? TrendingDown : Minus" class="w-4 h-4 text-teal-100" />
            <span class="text-xs text-teal-100">{{ trendLabel }}</span>
          </div>
        </div>
        <div class="text-right text-teal-100">
          <p class="text-xs">Last updated</p>
          <p class="text-sm font-semibold text-white">10:00 PM</p>
        </div>
      </div>

      <div class="relative z-10 grid grid-cols-3 gap-2">
        <div class="bg-white/10 rounded-xl p-3 text-center">
          <p class="text-xl font-bold">{{ stats.estimatedHbA1c }}%</p>
          <p class="text-[11px] text-teal-100 mt-0.5">Est. HbA1c</p>
        </div>
        <div class="bg-white/10 rounded-xl p-3 text-center">
          <p class="text-xl font-bold">{{ stats.timeInRange }}%</p>
          <p class="text-[11px] text-teal-100 mt-0.5">Time in Range</p>
        </div>
        <div class="bg-white/10 rounded-xl p-3 text-center">
          <p class="text-xl font-bold">{{ stats.averageGlucose }}</p>
          <p class="text-[11px] text-teal-100 mt-0.5">Avg (mg/dL)</p>
        </div>
      </div>
    </div>

    <!-- Quick stats row -->
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div class="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-7 h-7 bg-teal-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Activity class="w-3.5 h-3.5 text-teal-600" />
          </div>
          <span class="text-xs text-gray-500 font-medium">Variability</span>
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ stats.glucoseVariability }}%</p>
        <p class="text-xs text-gray-400 mt-0.5">CV target &lt;36%</p>
      </div>

      <div class="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Target class="w-3.5 h-3.5 text-green-600" />
          </div>
          <span class="text-xs text-gray-500 font-medium">Readings</span>
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ stats.totalReadings }}</p>
        <p class="text-xs text-gray-400 mt-0.5">Last 24 hrs</p>
      </div>

      <div class="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertTriangle class="w-3.5 h-3.5 text-red-500" />
          </div>
          <span class="text-xs text-gray-500 font-medium">Hypo Events</span>
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ stats.hypoEvents }}</p>
        <p class="text-xs text-gray-400 mt-0.5">This week</p>
      </div>

      <div class="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap class="w-3.5 h-3.5 text-amber-500" />
          </div>
          <span class="text-xs text-gray-500 font-medium">Hyper Events</span>
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ stats.hyperEvents }}</p>
        <p class="text-xs text-gray-400 mt-0.5">This week</p>
      </div>
    </div>

    <!-- Glucose Chart -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-5">
      <div class="flex items-center justify-between mb-1">
        <h3 class="text-base font-semibold text-gray-900">Glucose Trend</h3>
        <div class="flex items-center gap-3 text-xs text-gray-400">
          <span class="flex items-center gap-1.5">
            <span class="w-3 h-0.5 bg-teal-500 inline-block rounded" />
            Glucose
          </span>
          <span class="flex items-center gap-1.5">
            <span class="w-3 h-0.5 bg-amber-400 inline-block rounded" />
            Target
          </span>
        </div>
      </div>
      <p class="text-xs text-gray-400 mb-3">Target range: 70–180 mg/dL</p>
      <div class="h-48 sm:h-56">
        <Line :data="lineChartData" :options="lineChartOptions" />
      </div>
    </div>

    <!-- TIR + Recent Readings -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">

      <!-- Time in Range -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h3 class="text-base font-semibold text-gray-900 mb-3">Time in Range</h3>
        <div class="relative h-36 flex items-center justify-center">
          <Doughnut :data="tirChartData" :options="tirChartOptions" />
          <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p class="text-2xl font-bold text-gray-900">{{ stats.timeInRange }}%</p>
            <p class="text-xs text-gray-400">In Range</p>
          </div>
        </div>
        <div class="space-y-2 mt-3">
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 bg-teal-500 rounded-sm flex-shrink-0" />
              <span class="text-gray-600">In Range (70–180)</span>
            </div>
            <span class="font-semibold text-gray-900">{{ stats.timeInRange }}%</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 bg-amber-400 rounded-sm flex-shrink-0" />
              <span class="text-gray-600">High (&gt;180)</span>
            </div>
            <span class="font-semibold text-gray-900">{{ highPct }}%</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 bg-red-400 rounded-sm flex-shrink-0" />
              <span class="text-gray-600">Low (&lt;70)</span>
            </div>
            <span class="font-semibold text-gray-900">{{ lowPct }}%</span>
          </div>
        </div>
        <div class="mt-3 p-2.5 rounded-lg text-xs" :class="stats.timeInRange >= 70 ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700'">
          <CheckCircle v-if="stats.timeInRange >= 70" class="w-3.5 h-3.5 inline mr-1" />
          <Info v-else class="w-3.5 h-3.5 inline mr-1" />
          {{ stats.timeInRange >= 70 ? 'Goal achieved! Target is ≥70%' : `${70 - stats.timeInRange}% below goal. Target is ≥70%` }}
        </div>
      </div>

      <!-- Recent Readings -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-semibold text-gray-900">Recent Readings</h3>
          <Clock class="w-4 h-4 text-gray-400" />
        </div>
        <div class="space-y-1">
          <div
            v-for="r in recentReadings"
            :key="r.time"
            class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
          >
            <div>
              <p class="text-sm font-medium text-gray-800">{{ r.context }}</p>
              <p class="text-xs text-gray-400">{{ r.time }}</p>
            </div>
            <div class="text-right">
              <p
                class="text-sm font-bold"
                :class="r.value < 70 ? 'text-red-600' : r.value <= 180 ? 'text-teal-600' : 'text-amber-600'"
              >{{ r.value }} <span class="text-xs font-normal text-gray-400">mg/dL</span></p>
              <p
                class="text-[10px] font-medium"
                :class="r.value < 70 ? 'text-red-500' : r.value <= 180 ? 'text-teal-500' : 'text-amber-500'"
              >{{ r.value < 70 ? 'Low' : r.value <= 180 ? 'In Range' : 'High' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- AI Insights -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-5">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-7 h-7 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Zap class="w-4 h-4 text-white" />
        </div>
        <h3 class="text-base font-semibold text-gray-900">AI Insights</h3>
        <span class="ml-auto text-[10px] bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-2 py-0.5 font-semibold">GlucoGuard AI</span>
      </div>
      <div class="space-y-3">
        <div
          v-for="insight in insights"
          :key="insight.title"
          class="flex gap-3 p-3 rounded-xl"
          :class="{
            'bg-amber-50 border border-amber-100': insight.type === 'warning',
            'bg-green-50 border border-green-100': insight.type === 'success',
            'bg-blue-50 border border-blue-100': insight.type === 'info',
          }"
        >
          <span class="text-xl leading-none flex-shrink-0 mt-0.5">{{ insight.icon }}</span>
          <div class="min-w-0">
            <p
              class="text-sm font-semibold mb-0.5"
              :class="{
                'text-amber-800': insight.type === 'warning',
                'text-green-800': insight.type === 'success',
                'text-blue-800': insight.type === 'info',
              }"
            >{{ insight.title }}</p>
            <p
              class="text-xs leading-relaxed"
              :class="{
                'text-amber-700': insight.type === 'warning',
                'text-green-700': insight.type === 'success',
                'text-blue-700': insight.type === 'info',
              }"
            >{{ insight.text }}</p>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
