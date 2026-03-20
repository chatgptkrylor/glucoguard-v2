<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Line, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import {
  Activity, TrendingUp, CheckCircle, Info, AlertTriangle,
  Zap, Shield, Star, Flame, Plus, ArrowUp, ArrowDown,
  Minus, Award, BookOpen, HelpCircle, ChevronRight,
  Target, Clock, Utensils
} from 'lucide-vue-next'
import { analyzeGlucoseData } from '../ai/glucoseAnalysis'

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, Title, Tooltip, Legend, Filler
)

const isLoading = ref(true)
const selectedPeriod = ref<'24h' | '7d' | '30d'>('24h')
const showQuickLog = ref(false)
const loggedGlucose = ref('')
const recentlyLogged = ref(false)
const showTooltip = ref<string | null>(null)
const loggedFood = ref<string | null>(null)
const showCelebration = ref(false)

const streakDays = ref(7)
const personalBest = ref(14)

const currentGlucose = ref(142)
const previousGlucose = ref(155)

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
    setTimeout(() => {
      showCelebration.value = true
      setTimeout(() => showCelebration.value = false, 4000)
    }, 500)
  }, 1400)
})

const readings = ref([
  { value: 120, time: '8 AM' },
  { value: 145, time: '10 AM' },
  { value: 130, time: '12 PM' },
  { value: 160, time: '2 PM' },
  { value: 125, time: '4 PM' },
  { value: 150, time: '7 PM' },
  { value: 135, time: '9 PM' },
])

const stats = computed(() =>
  analyzeGlucoseData(readings.value.map(r => ({
    value: r.value,
    timestamp: new Date(),
    mealContext: 'fasting' as const
  })))
)

const glucoseTrend = computed(() => {
  const diff = currentGlucose.value - previousGlucose.value
  if (diff > 5) return 'rising'
  if (diff < -5) return 'falling'
  return 'stable'
})

const glucoseDiff = computed(() => currentGlucose.value - previousGlucose.value)

const logGlucose = () => {
  if (loggedGlucose.value) {
    recentlyLogged.value = true
    showQuickLog.value = false
    loggedGlucose.value = ''
    setTimeout(() => recentlyLogged.value = false, 3000)
  }
}

const indianFoods = [
  { name: 'Roti',   emoji: '🫓', carbs: 15 },
  { name: 'Rice',   emoji: '🍚', carbs: 28 },
  { name: 'Dal',    emoji: '🫘', carbs: 20 },
  { name: 'Sabzi',  emoji: '🥗', carbs: 8  },
  { name: 'Fruit',  emoji: '🍎', carbs: 15 },
]

const logFood = (name: string) => {
  loggedFood.value = name
  setTimeout(() => loggedFood.value = null, 2000)
}

const tooltips: Record<string, string> = {
  hba1c: 'HbA1c measures average blood sugar over 2–3 months. Below 7% is the general target for most people with diabetes.',
  tir: 'Time in Range (TIR) is the % of time your glucose stays between 70–180 mg/dL. A target of 70%+ is recommended by international guidelines.',
  dawn: 'Dawn Phenomenon is a natural morning rise in blood sugar caused by hormones released during sleep (cortisol, growth hormone).',
  hypoglycemia: 'Hypoglycemia (low blood sugar, <70 mg/dL) causes shakiness, sweating, and confusion. Keep fast-acting carbs nearby.',
}

const toggleTooltip = (key: string) => {
  showTooltip.value = showTooltip.value === key ? null : key
}

/* ── Chart configs ── */
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: 'index' as const },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(28,25,23,0.92)',
      titleColor: '#fafaf9',
      bodyColor: '#d6d3d1',
      borderColor: 'rgba(20,184,166,0.4)',
      borderWidth: 1,
      padding: 14,
      cornerRadius: 10,
      titleFont: { size: 13, weight: '600' as const },
      bodyFont: { size: 12 },
      displayColors: false,
      callbacks: { label: (ctx: any) => ` ${ctx.parsed.y} mg/dL` }
    }
  },
  scales: {
    y: {
      min: 50, max: 210,
      grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
      ticks: { color: '#a8a29e', font: { size: 11 }, padding: 8 }
    },
    x: {
      grid: { display: false },
      ticks: { color: '#a8a29e', font: { size: 11 }, padding: 8 }
    }
  }
}

const lineChartData = computed(() => ({
  labels: readings.value.map(r => r.time),
  datasets: [{
    data: readings.value.map(r => r.value),
    borderColor: '#14b8a6',
    backgroundColor: (ctx: any) => {
      const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 280)
      gradient.addColorStop(0, 'rgba(20,184,166,0.18)')
      gradient.addColorStop(1, 'rgba(20,184,166,0.00)')
      return gradient
    },
    fill: true,
    tension: 0.45,
    pointRadius: 5,
    pointHoverRadius: 7,
    pointBackgroundColor: '#14b8a6',
    pointBorderColor: '#ffffff',
    pointBorderWidth: 2,
    borderWidth: 2.5,
  }]
}))

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '76%',
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(28,25,23,0.92)',
      bodyColor: '#fafaf9',
      borderColor: 'rgba(0,0,0,0.1)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 10,
    }
  }
}

const doughnutData = computed(() => ({
  labels: ['In Range', 'Above', 'Below'],
  datasets: [{
    data: [75, 15, 10],
    backgroundColor: ['#22c55e', '#f59e0b', '#ef4444'],
    borderWidth: 0,
    hoverOffset: 6
  }]
}))
</script>

<template>
  <div class="space-y-5">

    <!-- Loading state -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-24">
      <div class="w-14 h-14 rounded-full border-2 border-teal-200 border-t-teal-500 animate-spin mb-5" />
      <p class="text-stone-600 font-medium">Analyzing your health data…</p>
      <p class="text-stone-400 text-sm mt-1">Just a moment</p>
    </div>

    <div v-else class="space-y-5 animate-fade-in-up">

      <!-- ── TRUST BANNER ── -->
      <div class="trust-banner">
        <div class="flex flex-wrap items-center gap-2.5">
          <div class="trust-badge trust-badge--teal">
            <Shield style="width:12px;height:12px" />
            Clinically Validated
          </div>
          <div class="trust-badge trust-badge--blue">
            <Star style="width:12px;height:12px" />
            98.7% Accuracy
          </div>
          <div class="trust-badge trust-badge--purple">
            <Award style="width:12px;height:12px" />
            Dr. Nadeem Rais, Endocrinologist
          </div>
          <div class="ml-auto hidden sm:flex items-center gap-1.5 text-xs text-stone-400">
            <Clock style="width:11px;height:11px" />
            Last sync: 2 min ago
          </div>
        </div>
      </div>

      <!-- ── CELEBRATION BANNER ── -->
      <Transition name="celebrate">
        <div v-if="showCelebration" class="celebration-banner">
          <span class="text-2xl">🎉</span>
          <div>
            <div class="font-bold text-emerald-800 text-sm">Great job, Arjun!</div>
            <div class="text-emerald-700 text-xs mt-0.5">Your glucose is in the optimal range. Keep the streak going!</div>
          </div>
          <button @click="showCelebration = false" class="ml-auto text-emerald-600 hover:text-emerald-800 text-lg leading-none">×</button>
        </div>
      </Transition>

      <!-- ── HERO STATS ── -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <!-- Current Glucose — hero teal card -->
        <div class="stat-hero relative overflow-hidden col-span-1">
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-3">
              <div class="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Activity style="width:18px;height:18px" class="text-white" />
              </div>
              <!-- Trend arrow pill -->
              <div
                class="trend-pill"
                :class="{
                  'trend-pill--up': glucoseTrend === 'rising',
                  'trend-pill--down': glucoseTrend === 'falling',
                  'trend-pill--stable': glucoseTrend === 'stable'
                }"
              >
                <ArrowUp v-if="glucoseTrend === 'rising'" style="width:10px;height:10px" />
                <ArrowDown v-else-if="glucoseTrend === 'falling'" style="width:10px;height:10px" />
                <Minus v-else style="width:10px;height:10px" />
                <span>{{ glucoseTrend === 'stable' ? 'Stable' : (glucoseDiff > 0 ? '+' : '') + glucoseDiff }}</span>
              </div>
            </div>
            <div class="text-white/75 text-xs font-medium mb-1 uppercase tracking-wide">Current Glucose</div>
            <div class="stat-value text-white">{{ currentGlucose }}</div>
            <div class="text-white/70 text-sm mt-1">mg/dL · In Range ✓</div>
            <div class="text-white/45 text-xs mt-0.5">vs 1 hour ago</div>
          </div>
        </div>

        <!-- Time in Range -->
        <div class="card-premium">
          <div class="flex items-start justify-between mb-3">
            <div class="w-9 h-9 rounded-xl icon-green flex items-center justify-center">
              <CheckCircle style="width:18px;height:18px" />
            </div>
            <button @click="toggleTooltip('tir')" class="help-btn" :class="{ 'help-btn--active': showTooltip === 'tir' }">
              <HelpCircle style="width:14px;height:14px" />
            </button>
          </div>
          <div class="text-stone-500 text-xs font-medium uppercase tracking-wide mb-1">Time in Range</div>
          <div class="text-3xl lg:text-4xl font-bold text-stone-800">{{ Math.round(stats.timeInRange.percentage) }}%</div>
          <div class="text-xs text-stone-400 mt-1.5">Target: 70%+</div>
          <div class="progress-track mt-3">
            <div class="progress-green" :style="`width:${Math.round(stats.timeInRange.percentage)}%`" />
          </div>
          <Transition name="tooltip-slide">
            <div v-if="showTooltip === 'tir'" class="tooltip-box mt-3">{{ tooltips.tir }}</div>
          </Transition>
        </div>

        <!-- 7-Day Average -->
        <div class="card-premium">
          <div class="w-9 h-9 rounded-xl icon-blue flex items-center justify-center mb-3">
            <TrendingUp style="width:18px;height:18px" />
          </div>
          <div class="text-stone-500 text-xs font-medium uppercase tracking-wide mb-1">7-Day Average</div>
          <div class="text-3xl lg:text-4xl font-bold text-stone-800">{{ Math.round(stats.average) }}</div>
          <div class="text-xs text-stone-400 mt-1.5">mg/dL</div>
          <div class="mt-2.5">
            <span class="badge badge-success" style="font-size:0.68rem;">↓ 5% vs last week</span>
          </div>
        </div>

        <!-- Est. HbA1c -->
        <div class="card-premium">
          <div class="flex items-start justify-between mb-3">
            <div class="w-9 h-9 rounded-xl icon-purple flex items-center justify-center">
              <Info style="width:18px;height:18px" />
            </div>
            <button @click="toggleTooltip('hba1c')" class="help-btn" :class="{ 'help-btn--active': showTooltip === 'hba1c' }">
              <HelpCircle style="width:14px;height:14px" />
            </button>
          </div>
          <div class="text-stone-500 text-xs font-medium uppercase tracking-wide mb-1">Est. HbA1c</div>
          <div class="text-3xl lg:text-4xl font-bold text-stone-800">{{ stats.estimatedHbA1c.toFixed(1) }}%</div>
          <div class="mt-2">
            <span class="badge badge-warning">
              <AlertTriangle style="width:10px;height:10px" />
              Above Target
            </span>
          </div>
          <Transition name="tooltip-slide">
            <div v-if="showTooltip === 'hba1c'" class="tooltip-box mt-3">{{ tooltips.hba1c }}</div>
          </Transition>
        </div>

      </div>

      <!-- ── STREAK + QUICK ACTIONS ── -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <!-- Streak Card -->
        <div class="streak-card">
          <div class="flex items-center gap-3 mb-4">
            <div class="streak-icon">
              <Flame style="width:20px;height:20px" />
            </div>
            <div>
              <div class="font-bold text-stone-800 text-sm">Days in Range</div>
              <div class="text-stone-400 text-xs">Keep the streak going!</div>
            </div>
          </div>
          <div class="flex items-end gap-3 mb-4">
            <div class="streak-number">{{ streakDays }}</div>
            <div class="pb-1.5">
              <div class="text-stone-500 text-sm font-medium">days</div>
              <div class="text-stone-400 text-xs">Best: {{ personalBest }} days 🏆</div>
            </div>
          </div>
          <!-- 14-day dot grid -->
          <div class="flex items-center gap-1.5">
            <div
              v-for="i in 14" :key="i"
              class="streak-dot"
              :class="i <= streakDays ? 'streak-dot--active' : 'streak-dot--empty'"
            />
          </div>
          <div class="text-xs text-stone-400 mt-2">Last 14 days</div>
        </div>

        <!-- Quick Log -->
        <div class="card-premium lg:col-span-2">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="section-title text-base">Quick Log</h3>
              <p class="section-subtitle text-xs">One-tap tracking</p>
            </div>
            <Transition name="fade">
              <span v-if="recentlyLogged" class="badge badge-success">✓ Logged!</span>
            </Transition>
          </div>

          <!-- Glucose log row -->
          <div class="flex items-center gap-3 mb-4">
            <Transition name="fade" mode="out-in">
              <div v-if="!showQuickLog" key="btn">
                <button @click="showQuickLog = true" class="btn-primary py-2 px-4 text-sm">
                  <Plus style="width:15px;height:15px" />
                  Log Glucose
                </button>
              </div>
              <div v-else key="input" class="flex items-center gap-2">
                <input
                  v-model="loggedGlucose"
                  type="number"
                  placeholder="mg/dL"
                  class="input-field w-28 py-2 text-sm"
                  min="40" max="400"
                  @keyup.enter="logGlucose"
                />
                <button @click="logGlucose" class="btn-primary py-2 px-4 text-sm">Save</button>
                <button @click="showQuickLog = false" class="btn-secondary py-2 px-3 text-sm">✕</button>
              </div>
            </Transition>
          </div>

          <!-- Indian food quick-log -->
          <div>
            <div class="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
              <Utensils style="width:11px;height:11px" />
              Quick Meal Log
            </div>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="food in indianFoods"
                :key="food.name"
                @click="logFood(food.name)"
                class="food-pill"
                :class="loggedFood === food.name ? 'food-pill--logged' : ''"
              >
                {{ food.emoji }} {{ food.name }}
                <span v-if="loggedFood !== food.name" class="food-pill-carbs">~{{ food.carbs }}g</span>
                <span v-else class="font-bold text-emerald-600">✓</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- ── CHARTS ── -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <!-- Glucose Trend -->
        <div class="card-premium lg:col-span-2">
          <div class="flex items-start justify-between mb-5">
            <div>
              <h3 class="section-title">Glucose Trend</h3>
              <p class="section-subtitle">Your levels over the last 24 hours</p>
            </div>
            <div class="flex items-center bg-stone-100 rounded-xl p-1 gap-0.5">
              <button
                v-for="period in ['24h','7d','30d']"
                :key="period"
                @click="selectedPeriod = period as any"
                :class="[
                  'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  selectedPeriod === period
                    ? 'bg-white text-teal-600 shadow-sm'
                    : 'text-stone-400 hover:text-stone-600'
                ]"
              >{{ period }}</button>
            </div>
          </div>

          <!-- Target range label -->
          <div class="flex items-center gap-2 mb-3">
            <div class="target-range-badge">
              <Target style="width:11px;height:11px" />
              Target: 70–180 mg/dL
            </div>
            <span class="text-xs text-stone-400">· 75% in range today</span>
          </div>

          <div class="h-64">
            <Line :data="lineChartData" :options="lineChartOptions" />
          </div>

          <div class="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-stone-100">
            <div class="flex items-center gap-1.5">
              <div class="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span class="text-stone-500 text-xs">In Range (70–180)</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span class="text-stone-500 text-xs">Above Range</span>
            </div>
            <div class="flex items-center gap-1.5">
              <div class="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span class="text-stone-500 text-xs">Below Range</span>
            </div>
          </div>
        </div>

        <!-- Time in Range Donut -->
        <div class="card-premium flex flex-col">
          <h3 class="section-title mb-0.5">Time in Range</h3>
          <p class="section-subtitle mb-4">Distribution today</p>

          <div class="flex-1 min-h-48 relative">
            <Doughnut :data="doughnutData" :options="doughnutOptions" />
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="text-center">
                <div class="text-3xl font-bold text-stone-800">75%</div>
                <div class="text-stone-400 text-xs mt-0.5">in range</div>
              </div>
            </div>
          </div>

          <!-- Contextual insight -->
          <div class="what-this-means mt-4">
            <div class="what-this-means__label">
              <BookOpen style="width:11px;height:11px" />
              What this means
            </div>
            <p class="what-this-means__text">75% TIR meets the recommended target. Aim for 80%+ for optimal control.</p>
          </div>

          <div class="space-y-2.5 mt-4 pt-4 border-t border-stone-100">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span class="text-stone-500 text-sm">In Range</span>
              </div>
              <span class="text-stone-800 font-semibold text-sm">75%</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span class="text-stone-500 text-sm">Above</span>
              </div>
              <span class="text-stone-800 font-semibold text-sm">15%</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span class="text-stone-500 text-sm">Below</span>
              </div>
              <span class="text-stone-800 font-semibold text-sm">10%</span>
            </div>
          </div>
        </div>

      </div>

      <!-- ── AI INSIGHTS ── -->
      <div class="card-premium">
        <div class="flex flex-wrap items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center icon-purple">
            <Zap style="width:20px;height:20px" />
          </div>
          <div>
            <h3 class="section-title">AI Health Insights</h3>
            <p class="section-subtitle">Personalized predictions based on your patterns</p>
          </div>
          <div class="ml-auto">
            <span class="badge badge-teal" style="font-size:0.68rem;">
              <Shield style="width:10px;height:10px" />
              Reviewed by Dr. Rais
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

          <!-- Hypoglycemia risk — medium/amber -->
          <div class="insight-card insight-card--amber">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-1.5">
                <span class="text-stone-700 font-semibold text-sm">Hypoglycemia Risk</span>
                <button @click="toggleTooltip('hypoglycemia')" class="help-btn">
                  <HelpCircle style="width:12px;height:12px" />
                </button>
              </div>
              <span class="badge badge-warning">Medium</span>
            </div>
            <div class="text-3xl font-bold text-amber-600 mb-2">35%</div>
            <div class="progress-track mb-3">
              <div class="progress-amber" style="width:35%" />
            </div>
            <p class="text-stone-500 text-xs leading-relaxed mb-3">Consider a small snack before bedtime to prevent overnight lows.</p>
            <div class="what-this-means">
              <div class="what-this-means__label">
                <BookOpen style="width:11px;height:11px" />
                What this means
              </div>
              <p class="what-this-means__text">Moderate risk. Keep 15g fast carbs (juice, glucose tabs) nearby at night.</p>
            </div>
            <Transition name="tooltip-slide">
              <div v-if="showTooltip === 'hypoglycemia'" class="tooltip-box mt-3">{{ tooltips.hypoglycemia }}</div>
            </Transition>
          </div>

          <!-- Dawn Phenomenon — high/red -->
          <div class="insight-card insight-card--red">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-1.5">
                <span class="text-stone-700 font-semibold text-sm">Dawn Phenomenon</span>
                <button @click="toggleTooltip('dawn')" class="help-btn">
                  <HelpCircle style="width:12px;height:12px" />
                </button>
              </div>
              <span class="badge badge-danger">High</span>
            </div>
            <div class="text-3xl font-bold text-red-500 mb-2">78%</div>
            <div class="progress-track mb-3">
              <div class="progress-red" style="width:78%" />
            </div>
            <p class="text-stone-500 text-xs leading-relaxed mb-3">Expect elevated morning glucose — discuss medication timing with your doctor.</p>
            <div class="what-this-means">
              <div class="what-this-means__label">
                <BookOpen style="width:11px;height:11px" />
                What this means
              </div>
              <p class="what-this-means__text">High dawn effect detected. Dr. Rais may consider adjusting your basal insulin timing.</p>
            </div>
            <Transition name="tooltip-slide">
              <div v-if="showTooltip === 'dawn'" class="tooltip-box mt-3">{{ tooltips.dawn }}</div>
            </Transition>
          </div>

          <!-- Post-Meal Spike — low/green -->
          <div class="insight-card insight-card--green">
            <div class="flex items-center justify-between mb-3">
              <span class="text-stone-700 font-semibold text-sm">Post-Meal Spike</span>
              <span class="badge badge-success">Low ✓</span>
            </div>
            <div class="text-3xl font-bold text-emerald-600 mb-2">25%</div>
            <div class="progress-track mb-3">
              <div class="progress-green" style="width:25%" />
            </div>
            <p class="text-stone-500 text-xs leading-relaxed mb-3">Your meals are well-balanced. Keep up the great work!</p>
            <!-- Positive reinforcement -->
            <div class="positive-reinforcement">
              <span class="text-base">🌟</span>
              <span class="text-emerald-700 text-xs font-semibold">Excellent meal management!</span>
            </div>
          </div>

        </div>
      </div>

      <!-- ── EDUCATIONAL FOOTER ── -->
      <div class="edu-banner">
        <div class="flex items-start gap-3">
          <div class="edu-banner__icon">
            <BookOpen style="width:15px;height:15px" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-semibold text-stone-700 text-sm mb-1">About These Insights</div>
            <p class="text-stone-500 text-xs leading-relaxed">
              GlucoGuard uses clinically validated algorithms reviewed by <strong>Dr. Nadeem Rais, Endocrinologist</strong>.
              These insights are <strong>educational</strong> and complement — not replace — advice from your healthcare team.
            </p>
          </div>
          <button class="text-teal-600 hover:text-teal-700 text-xs font-semibold flex items-center gap-1 whitespace-nowrap flex-shrink-0">
            Learn more <ChevronRight style="width:12px;height:12px" />
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.45s cubic-bezier(0.16,1,0.3,1) both;
}

/* Insight cards */
.insight-card {
  border-radius: 16px;
  padding: 1.125rem;
  border: 1px solid;
}
.insight-card--amber { background: #fffbeb; border-color: rgba(245,158,11,0.2); }
.insight-card--red   { background: #fef2f2; border-color: rgba(239,68,68,0.15); }
.insight-card--green { background: #f0fdf4; border-color: rgba(34,197,94,0.2); }

/* Trend pill */
.trend-pill {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.01em;
}
.trend-pill--up     { background: rgba(239,68,68,0.25); color: #fecaca; }
.trend-pill--down   { background: rgba(34,197,94,0.25); color: #bbf7d0; }
.trend-pill--stable { background: rgba(255,255,255,0.25); color: rgba(255,255,255,0.9); }

/* Help button */
.help-btn {
  color: #d6d3d1;
  padding: 2px;
  border-radius: 4px;
  transition: color 0.15s;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.help-btn:hover, .help-btn--active { color: #14b8a6; }

/* Tooltip transitions */
.tooltip-slide-enter-active, .tooltip-slide-leave-active {
  transition: all 0.2s ease;
}
.tooltip-slide-enter-from, .tooltip-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Celebration transition */
.celebrate-enter-active { transition: all 0.4s cubic-bezier(0.16,1,0.3,1); }
.celebrate-leave-active { transition: all 0.3s ease; }
.celebrate-enter-from, .celebrate-leave-to { opacity: 0; transform: translateY(-10px) scale(0.98); }

/* Fade transition */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Icon helpers */
.icon-green  { background: #dcfce7; color: #15803d; }
.icon-blue   { background: #dbeafe; color: #1d4ed8; }
.icon-purple { background: #ede9fe; color: #7c3aed; }
</style>
