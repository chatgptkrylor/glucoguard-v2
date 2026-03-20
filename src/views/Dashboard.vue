<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Line, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import { Activity, TrendingUp, TrendingDown, CheckCircle, Info, AlertTriangle, Loader2, Heart, Zap, Moon } from 'lucide-vue-next'
import { analyzeGlucoseData } from '../ai/glucoseAnalysis'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler)

const isLoading = ref(true)
const selectedPeriod = ref<'24h' | '7d' | '30d'>('24h')

onMounted(() => {
  setTimeout(() => isLoading.value = false, 1500)
})

const readings = ref([
  { value: 120, time: '8 AM' },
  { value: 145, time: '10 AM' },
  { value: 130, time: '1 PM' },
  { value: 160, time: '2:30 PM' },
  { value: 125, time: '6 PM' },
  { value: 150, time: '8 PM' },
  { value: 135, time: '10 PM' },
])

const stats = computed(() => analyzeGlucoseData(readings.value.map(r => ({ value: r.value, timestamp: new Date(), mealContext: 'fasting' as const }))))

// Premium chart options
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: 'index' as const },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(3, 7, 18, 0.95)',
      titleColor: '#f9fafb',
      bodyColor: '#f9fafb',
      borderColor: 'rgba(20, 184, 166, 0.3)',
      borderWidth: 1,
      padding: 16,
      cornerRadius: 12,
      titleFont: { size: 14, weight: '600' },
      bodyFont: { size: 13 },
      displayColors: false,
      callbacks: {
        label: (context: any) => ` ${context.parsed.y} mg/dL`
      }
    }
  },
  scales: {
    y: {
      min: 50, max: 200,
      grid: { color: 'rgba(255,255,255,0.03)', drawBorder: false },
      ticks: { color: '#6b7280', font: { size: 11 }, padding: 8 }
    },
    x: {
      grid: { display: false },
      ticks: { color: '#6b7280', font: { size: 11 }, padding: 8 }
    }
  }
}

const lineChartData = computed(() => ({
  labels: readings.value.map(r => r.time),
  datasets: [{
    data: readings.value.map(r => r.value),
    borderColor: '#14b8a6',
    backgroundColor: (ctx: any) => {
      const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300)
      gradient.addColorStop(0, 'rgba(20, 184, 166, 0.3)')
      gradient.addColorStop(1, 'rgba(20, 184, 166, 0)')
      return gradient
    },
    fill: true,
    tension: 0.4,
    pointRadius: 6,
    pointHoverRadius: 8,
    pointBackgroundColor: '#14b8a6',
    pointBorderColor: '#0f172a',
    pointBorderWidth: 3,
  }]
}))

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '75%',
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(3, 7, 18, 0.95)',
      bodyColor: '#f9fafb',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 10,
    }
  }
}

const doughnutData = computed(() => ({
  labels: ['In Range', 'Below', 'Above'],
  datasets: [{
    data: [75, 10, 15],
    backgroundColor: ['#22c55e', '#f43f5e', '#f59e0b'],
    borderWidth: 0,
    hoverOffset: 4
  }]
}))
</script>

<template>
  <div class="space-y-8">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
      <div class="relative">
        <div class="w-16 h-16 rounded-full border-2 border-[#14b8a6]/20 border-t-[#14b8a6] animate-spin"></div>
      </div>
      <p class="mt-6 text-[#9ca3af] text-lg">Analyzing your health data...</p>
      <p class="mt-2 text-[#6b7280] text-sm">This takes just a moment</p>
    </div>

    <div v-else class="space-y-8 animate-fade-in-up">
      <!-- Hero Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Current Glucose -->
        <div class="stat-hero relative overflow-hidden">
          <div class="relative z-10">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-10 h-10 rounded-xl bg-[#14b8a6]/20 flex items-center justify-center">
                <Activity class="w-5 h-5 text-[#14b8a6]" />
              </div>
            </div>
            <div class="stat-value text-4xl lg:text-5xl">142</div>
            <div class="text-[#9ca3af] text-sm mt-1">mg/dL</div>
            <div class="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#22c55e]/10 text-[#4ade80] text-xs font-semibold">
              <TrendingDown class="w-3 h-3" />
              In Range
            </div>
          </div>
        </div>

        <!-- Time in Range -->
        <div class="card-premium">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-10 h-10 rounded-xl bg-[#22c55e]/20 flex items-center justify-center">
              <CheckCircle class="w-5 h-5 text-[#22c55e]" />
            </div>
          </div>
          <div class="text-4xl lg:text-5xl font-bold text-white">{{ Math.round(stats.timeInRange.percentage) }}%</div>
          <div class="text-[#9ca3af] text-sm mt-1">Time in Range</div>
          <div class="mt-3 text-[#6b7280] text-xs">Target: 70%+</div>
        </div>

        <!-- Average -->
        <div class="card-premium">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <TrendingUp class="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div class="text-4xl lg:text-5xl font-bold text-white">{{ Math.round(stats.average) }}</div>
          <div class="text-[#9ca3af] text-sm mt-1">7-Day Average</div>
          <div class="mt-3 text-[#6b7280] text-xs">mg/dL</div>
        </div>

        <!-- HbA1c -->
        <div class="card-premium">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <Info class="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div class="text-4xl lg:text-5xl font-bold text-white">{{ stats.estimatedHbA1c.toFixed(1) }}</div>
          <div class="text-[#9ca3af] text-sm mt-1">Est. HbA1c</div>
          <div class="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f43f5e]/10 text-[#fb7185] text-xs font-semibold">
            <AlertTriangle class="w-3 h-3" />
003e
            Above Target
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Glucose Trend -->
        <div class="lg:col-span-2 card-premium">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-xl font-bold text-white">Glucose Trend</h3>
              <p class="text-[#6b7280] text-sm mt-1">Your levels over the last 24 hours</p>
            </div>
            <div class="flex bg-[#111827] rounded-xl p-1">
              <button 
                v-for="period in ['24h', '7d', '30d']" 
                :key="period"
                @click="selectedPeriod = period as any"
                :class="[
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  selectedPeriod === period 
                    ? 'bg-[#14b8a6] text-white shadow-lg' 
                    : 'text-[#6b7280] hover:text-white'
                ]"
              >
                {{ period }}
              </button>
            </div>
          </div>
          
          <div class="h-72">
            <Line :data="lineChartData" :options="lineChartOptions" />
          </div>
          
          <div class="flex items-center gap-6 mt-4 pt-4 border-t border-white/5">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-[#22c55e]"></div>
              <span class="text-[#6b7280] text-sm">In Range (70-180)</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-full bg-[#f43f5e]"></div>
              <span class="text-[#6b7280] text-sm">High/Low</span>
            </div>
          </div>
        </div>

        <!-- Time in Range Chart -->
        <div class="card-premium flex flex-col">
          <div class="mb-4">
            <h3 class="text-xl font-bold text-white">Time in Range</h3>
            <p class="text-[#6b7280] text-sm mt-1">Distribution today</p>
          </div>
          
          <div class="flex-1 min-h-[200px] relative">
            <Doughnut :data="doughnutData" :options="doughnutOptions" />
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div class="text-center">
                <div class="text-3xl font-bold text-white">75%</div>
                <div class="text-[#6b7280] text-sm">in range</div>
              </div>
            </div>
          </div>
          
          <div class="mt-6 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-[#22c55e]"></div>
                <span class="text-[#9ca3af] text-sm">In Range</span>
              </div>
              <span class="text-white font-semibold">75%</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
                <span class="text-[#9ca3af] text-sm">Above</span>
              </div>
              <span class="text-white font-semibold">15%</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-[#f43f5e]"></div>
                <span class="text-[#9ca3af] text-sm">Below</span>
              </div>
              <span class="text-white font-semibold">10%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- AI Insights -->
      <div class="card-premium">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Zap class="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-white">AI Health Insights</h3>
            <p class="text-[#6b7280] text-sm">Personalized predictions based on your patterns</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Insight Card 1 -->
          <div class="bg-[#111827] rounded-2xl p-5 border border-[#f43f5e]/20">
            <div class="flex items-center justify-between mb-4">
              <span class="text-white font-medium">Hypoglycemia Risk</span>
              <span class="badge-elegant badge-warning">Medium</span>
            </div>
            <div class="text-3xl font-bold text-[#fbbf24] mb-2">35%</div>
            <div class="w-full bg-[#1f2937] rounded-full h-2 mb-4">
              <div class="h-2 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#f43f5e]" style="width: 35%"></div>
            </div>
            <p class="text-[#6b7280] text-sm">Consider a small snack before bedtime</p>
          </div>

          <!-- Insight Card 2 -->
          <div class="bg-[#111827] rounded-2xl p-5 border border-[#f43f5e]/20">
            <div class="flex items-center justify-between mb-4">
              <span class="text-white font-medium">Dawn Phenomenon</span>
              <span class="badge-elegant badge-danger">High</span>
            </div>
            <div class="text-3xl font-bold text-[#f43f5e] mb-2">78%</div>
            <div class="w-full bg-[#1f2937] rounded-full h-2 mb-4">
              <div class="h-2 rounded-full bg-gradient-to-r from-[#f43f5e] to-[#e11d48]" style="width: 78%"></div>
            </div>
            <p class="text-[#6b7280] text-sm">Expect elevated morning glucose</p>
          </div>

          <!-- Insight Card 3 -->
          <div class="bg-[#111827] rounded-2xl p-5 border border-[#22c55e]/20">
            <div class="flex items-center justify-between mb-4">
              <span class="text-white font-medium">Post-Meal Spike</span>
              <span class="badge-elegant badge-success">Low</span>
            </div>
            <div class="text-3xl font-bold text-[#22c55e] mb-2">25%</div>
            <div class="w-full bg-[#1f2937] rounded-full h-2 mb-4">
              <div class="h-2 rounded-full bg-gradient-to-r from-[#22c55e] to-[#16a34a]" style="width: 25%"></div>
            </div>
            <p class="text-[#6b7280] text-sm">Your meals are well balanced</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}
</style>
