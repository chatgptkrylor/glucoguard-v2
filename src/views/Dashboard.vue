<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Line, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import {
  Activity, TrendingUp, TrendingDown, CheckCircle,
  Info, AlertTriangle, Loader2, Zap
} from 'lucide-vue-next'
import { analyzeGlucoseData } from '../ai/glucoseAnalysis'

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  ArcElement, Title, Tooltip, Legend, Filler
)

const isLoading = ref(true)
const selectedPeriod = ref<'24h' | '7d' | '30d'>('24h')

onMounted(() => {
  setTimeout(() => isLoading.value = false, 1400)
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

/* ── Chart configs (light theme) ── */
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
  <div class="space-y-6">

    <!-- Loading state -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-24">
      <div class="w-14 h-14 rounded-full border-2 border-teal-200 border-t-teal-500 animate-spin mb-5" />
      <p class="text-stone-600 font-medium">Analyzing your health data…</p>
      <p class="text-stone-400 text-sm mt-1">Just a moment</p>
    </div>

    <div v-else class="space-y-6 animate-fade-in-up">

      <!-- ── HERO STATS ── -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <!-- Current Glucose — hero teal card -->
        <div class="stat-hero relative overflow-hidden col-span-1">
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-3">
              <div class="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Activity class="w-4.5 h-4.5 text-white" style="width:18px;height:18px" />
              </div>
              <span class="badge" style="background:rgba(255,255,255,0.2);color:white;font-size:0.7rem;">
                <TrendingDown class="w-3 h-3" style="width:12px;height:12px" />
                In Range
              </span>
            </div>
            <div class="text-white/75 text-xs font-medium mb-1 uppercase tracking-wide">Current Glucose</div>
            <div class="stat-value text-white">142</div>
            <div class="text-white/70 text-sm mt-1">mg/dL</div>
          </div>
        </div>

        <!-- Time in Range -->
        <div class="card-premium">
          <div class="w-9 h-9 rounded-xl icon-green flex items-center justify-center mb-3">
            <CheckCircle class="w-4.5 h-4.5" style="width:18px;height:18px" />
          </div>
          <div class="text-stone-500 text-xs font-medium uppercase tracking-wide mb-1">Time in Range</div>
          <div class="text-3xl lg:text-4xl font-bold text-stone-800">{{ Math.round(stats.timeInRange.percentage) }}%</div>
          <div class="text-xs text-stone-400 mt-1.5">Target: 70%+</div>
          <div class="progress-track mt-3">
            <div class="progress-green" :style="`width:${Math.round(stats.timeInRange.percentage)}%`" />
          </div>
        </div>

        <!-- 7-Day Average -->
        <div class="card-premium">
          <div class="w-9 h-9 rounded-xl icon-blue flex items-center justify-center mb-3">
            <TrendingUp class="w-4.5 h-4.5" style="width:18px;height:18px" />
          </div>
          <div class="text-stone-500 text-xs font-medium uppercase tracking-wide mb-1">7-Day Average</div>
          <div class="text-3xl lg:text-4xl font-bold text-stone-800">{{ Math.round(stats.average) }}</div>
          <div class="text-xs text-stone-400 mt-1.5">mg/dL</div>
        </div>

        <!-- Est. HbA1c -->
        <div class="card-premium">
          <div class="w-9 h-9 rounded-xl icon-purple flex items-center justify-center mb-3">
            <Info class="w-4.5 h-4.5" style="width:18px;height:18px" />
          </div>
          <div class="text-stone-500 text-xs font-medium uppercase tracking-wide mb-1">Est. HbA1c</div>
          <div class="text-3xl lg:text-4xl font-bold text-stone-800">{{ stats.estimatedHbA1c.toFixed(1) }}</div>
          <div class="mt-2">
            <span class="badge badge-warning">
              <AlertTriangle style="width:10px;height:10px" />
              Above Target
            </span>
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
            <!-- Period selector -->
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

          <div class="h-64">
            <Line :data="lineChartData" :options="lineChartOptions" />
          </div>

          <div class="flex items-center gap-5 mt-4 pt-4 border-t border-stone-100">
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

          <div class="space-y-2.5 mt-5 pt-4 border-t border-stone-100">
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
        <div class="flex items-center gap-3 mb-5">
          <div class="w-10 h-10 rounded-2xl flex items-center justify-center icon-purple">
            <Zap class="w-5 h-5" />
          </div>
          <div>
            <h3 class="section-title">AI Health Insights</h3>
            <p class="section-subtitle">Personalized predictions based on your patterns</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

          <!-- Hypoglycemia risk — medium/amber -->
          <div class="insight-card insight-card--amber">
            <div class="flex items-center justify-between mb-3">
              <span class="text-stone-700 font-semibold text-sm">Hypoglycemia Risk</span>
              <span class="badge badge-warning">Medium</span>
            </div>
            <div class="text-3xl font-bold text-amber-600 mb-2">35%</div>
            <div class="progress-track mb-3">
              <div class="progress-amber" style="width:35%" />
            </div>
            <p class="text-stone-500 text-xs leading-relaxed">Consider a small snack before bedtime to prevent overnight lows.</p>
          </div>

          <!-- Dawn Phenomenon — high/red -->
          <div class="insight-card insight-card--red">
            <div class="flex items-center justify-between mb-3">
              <span class="text-stone-700 font-semibold text-sm">Dawn Phenomenon</span>
              <span class="badge badge-danger">High</span>
            </div>
            <div class="text-3xl font-bold text-red-500 mb-2">78%</div>
            <div class="progress-track mb-3">
              <div class="progress-red" style="width:78%" />
            </div>
            <p class="text-stone-500 text-xs leading-relaxed">Expect elevated morning glucose — discuss medication timing with your doctor.</p>
          </div>

          <!-- Post-Meal Spike — low/green -->
          <div class="insight-card insight-card--green">
            <div class="flex items-center justify-between mb-3">
              <span class="text-stone-700 font-semibold text-sm">Post-Meal Spike</span>
              <span class="badge badge-success">Low</span>
            </div>
            <div class="text-3xl font-bold text-emerald-600 mb-2">25%</div>
            <div class="progress-track mb-3">
              <div class="progress-green" style="width:25%" />
            </div>
            <p class="text-stone-500 text-xs leading-relaxed">Your meals are well-balanced. Keep up the great work!</p>
          </div>

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

.insight-card--amber {
  background: #fffbeb;
  border-color: rgba(245,158,11,0.2);
}

.insight-card--red {
  background: #fef2f2;
  border-color: rgba(239,68,68,0.15);
}

.insight-card--green {
  background: #f0fdf4;
  border-color: rgba(34,197,94,0.2);
}

/* Icon helpers (reuse from global but scoped here for safety) */
.icon-green  { background: #dcfce7; color: #15803d; }
.icon-blue   { background: #dbeafe; color: #1d4ed8; }
.icon-purple { background: #ede9fe; color: #7c3aed; }
</style>
