<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  Bell, 
  AlertTriangle, 
  AlertCircle, 
  Info,
  CheckCircle2,
  Clock,
  TrendingDown,
  TrendingUp,
  Activity,
  Moon,
  Sun,
  Coffee,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-vue-next'
import { 
  predictHypoglycemia, 
  predictHyperglycemia, 
  analyzeGlucosePatterns,
  generateAlerts,
  Alert,
  Pattern
} from '../ai/predictiveAlerts'
import { indianFoods } from '../data/indianFoods'

// Mock glucose readings for demo
const mockReadings = ref([
  { value: 140, timestamp: new Date(Date.now() - 3600000 * 8), mealContext: 'fasting' as const },
  { value: 180, timestamp: new Date(Date.now() - 3600000 * 6), mealContext: 'after_meal' as const },
  { value: 160, timestamp: new Date(Date.now() - 3600000 * 4), mealContext: 'before_meal' as const },
  { value: 200, timestamp: new Date(Date.now() - 3600000 * 2), mealContext: 'after_meal' as const },
  { value: 140, timestamp: new Date(), mealContext: 'before_meal' as const },
])

const currentGlucose = ref(140)
const timeSinceLastMeal = ref(4)

const hypoglycemiaRisk = computed(() => 
  predictHypoglycemia(mockReadings.value, currentGlucose.value, timeSinceLastMeal.value)
)

const hyperglycemiaRisk = computed(() => 
  predictHyperglycemia(mockReadings.value, currentGlucose.value)
)

const patterns = computed(() => 
  analyzeGlucosePatterns(mockReadings.value)
)

const alerts = ref<Alert[]>([
  {
    id: '1',
    type: 'hypoglycemia',
    severity: 'warning',
    title: 'Hypoglycemia Risk Detected',
    message: 'Based on your recent readings and time since last meal, you may experience low blood sugar within the next 2 hours.',
    timestamp: new Date(),
    action: 'Consider having a snack with 15-20g carbs',
    acknowledged: false
  },
  {
    id: '2',
    type: 'pattern',
    severity: 'info',
    title: 'Post-Meal Spike Pattern',
    message: 'Your glucose consistently rises 40-60 mg/dL after meals. Consider smaller portions or lower GI foods.',
    timestamp: new Date(Date.now() - 3600000 * 2),
    action: 'Review meal composition in Meal Planner',
    acknowledged: false
  },
  {
    id: '3',
    type: 'lifestyle',
    severity: 'info',
    title: 'Evening Glucose Trend',
    message: 'Your evening readings have been 15% higher than morning. This could indicate dawn phenomenon.',
    timestamp: new Date(Date.now() - 3600000 * 24),
    action: 'Monitor bedtime snacks and medication timing',
    acknowledged: true
  }
])

const unacknowledgedAlerts = computed(() => alerts.value.filter(a => !a.acknowledged))
const acknowledgedAlerts = computed(() => alerts.value.filter(a => a.acknowledged))

const expandedAlert = ref<string | null>(null)

function acknowledgeAlert(id: string) {
  const alert = alerts.value.find(a => a.id === id)
  if (alert) alert.acknowledged = true
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/30'
    case 'warning': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30'
    default: return 'text-blue-400 bg-blue-400/10 border-blue-400/30'
  }
}

function getSeverityIcon(severity: string) {
  switch (severity) {
    case 'critical': return AlertTriangle
    case 'warning': return AlertCircle
    default: return Info
  }
}

function getAlertTypeIcon(type: string) {
  switch (type) {
    case 'hypoglycemia': return TrendingDown
    case 'hyperglycemia': return TrendingUp
    case 'pattern': return Activity
    default: return Bell
  }
}

function getRiskColor(risk: string): string {
  switch (risk) {
    case 'high': return 'text-red-400'
    case 'medium': return 'text-yellow-400'
    default: return 'text-emerald-400'
  }
}

function getRiskBg(risk: string): string {
  switch (risk) {
    case 'high': return 'bg-red-400'
    case 'medium': return 'bg-yellow-400'
    default: return 'bg-emerald-400'
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-slate-800 rounded-2xl p-6 border border-slate-700">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center">
          <Bell class="text-white" :size="24" />
        </div>
        <div>
          <h2 class="text-2xl font-bold text-white">AI Predictive Alerts</h2>
          <p class="text-slate-400">Real-time glucose risk analysis and pattern detection</p>
        </div>
      </div>

      <!-- Active Alerts Badge -->
      <div v-if="unacknowledgedAlerts.length > 0" class="flex items-center gap-2">
        <span class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        <span class="text-red-400 font-medium">{{ unacknowledgedAlerts.length }} active alert{{ unacknowledgedAlerts.length !== 1 ? 's' : '' }} requiring attention</span>
      </div>
    </div>

    <!-- Risk Dashboard -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Hypoglycemia Risk -->
      <div class="bg-slate-800 rounded-xl p-5 border border-slate-700">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <TrendingDown class="text-blue-400" :size="20" />
          </div>
          <div>
            <h3 class="font-semibold text-white">Hypoglycemia Risk</h3>
            <p class="text-xs text-slate-400">Low blood sugar</p>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Risk Level</span>
            <span :class="`font-bold capitalize ${getRiskColor(hypoglycemiaRisk.risk)}`">
              {{ hypoglycemiaRisk.risk }}
            </span>
          </div>

          <div class="w-full bg-slate-700 rounded-full h-2">
            <div 
              :class="`h-2 rounded-full transition-all ${getRiskBg(hypoglycemiaRisk.risk)}`"
              :style="{ width: `${hypoglycemiaRisk.confidence * 100}%` }"
            ></div>
          </div>

          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-400">Confidence</span>
            <span class="text-white">{{ Math.round(hypoglycemiaRisk.confidence * 100) }}%</span>
          </div>

          <div v-if="hypoglycemiaRisk.predictedTime" class="flex items-center gap-2 p-3 bg-blue-500/10 rounded-lg">
            <Clock class="w-4 h-4 text-blue-400" />
            <span class="text-sm text-blue-300">
              Predicted in {{ Math.round((hypoglycemiaRisk.predictedTime.getTime() - Date.now()) / 60000) }} minutes
            </span>
          </div>
        </div>
      </div>

      <!-- Hyperglycemia Risk -->
      <div class="bg-slate-800 rounded-xl p-5 border border-slate-700">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
            <TrendingUp class="text-red-400" :size="20" />
          </div>
          <div>
            <h3 class="font-semibold text-white">Hyperglycemia Risk</h3>
            <p class="text-xs text-slate-400">High blood sugar</p>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-slate-400">Risk Level</span>
            <span :class="`font-bold capitalize ${getRiskColor(hyperglycemiaRisk.risk)}`">
              {{ hyperglycemiaRisk.risk }}
            </span>
          </div>

          <div class="w-full bg-slate-700 rounded-full h-2">
            <div 
              :class="`h-2 rounded-full transition-all ${getRiskBg(hyperglycemiaRisk.risk)}`"
              :style="{ width: `${hyperglycemiaRisk.confidence * 100}%` }"
            ></div>
          </div>

          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-400">Confidence</span>
            <span class="text-white">{{ Math.round(hyperglycemiaRisk.confidence * 100) }}%</span>
          </div>

          <div class="flex items-center gap-2 p-3 bg-red-500/10 rounded-lg">
            <Activity class="w-4 h-4 text-red-400" />
            <span class="text-sm text-red-300">
              {{ hyperglycemiaRisk.trend }}
            </span>
          </div>
        </div>
      </div>

      <!-- Pattern Summary -->
      <div class="bg-slate-800 rounded-xl p-5 border border-slate-700">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
            <Activity class="text-purple-400" :size="20" />
          </div>
          <div>
            <h3 class="font-semibold text-white">Detected Patterns</h3>
            <p class="text-xs text-slate-400">{{ patterns.length }} pattern{{ patterns.length !== 1 ? 's' : '' }} found</p>
          </div>
        </div>

        <div class="space-y-2">
          <div v-for="(pattern, i) in patterns.slice(0, 3)" :key="i" class="p-3 bg-slate-700/50 rounded-lg">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-lg">
                {{ pattern.type === 'dawn_phenomenon' ? '🌅' : 
                   pattern.type === 'post_meal_spike' ? '🍽️' :
                   pattern.type === 'nighttime_low' ? '🌙' :
                   pattern.type === 'morning_high' ? '☀️' : '📊' }}
              </span>
              <span class="font-medium text-white capitalize">{{ pattern.type.replace('_', ' ') }}</span>
            </div>
            <p class="text-xs text-slate-400">{{ pattern.description }}</p>
            <div class="mt-2 flex items-center justify-between">
              <span class="text-xs text-purple-400">{{ Math.round(pattern.confidence * 100) }}% confidence</span>
              <span class="text-xs text-slate-500">{{ pattern.occurrence }}x detected</span>
            </div>
          </div>

          <div v-if="patterns.length === 0" class="text-center py-4 text-slate-500">
            <p>No patterns detected yet</p>
            <p class="text-xs mt-1">Add more readings for pattern analysis</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Alerts -->
    <div>
      <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
        Active Alerts ({{ unacknowledgedAlerts.length }})
      </h3>

      <div class="space-y-3">
        <div 
          v-for="alert in unacknowledgedAlerts" 
          :key="alert.id"
          :class="`bg-slate-800 rounded-xl border transition-all ${getSeverityColor(alert.severity)}`"
        >
          <div class="p-4">
            <div class="flex items-start gap-3">
              <component :is="getAlertTypeIcon(alert.type)" class="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <h4 class="font-semibold">{{ alert.title }}</h4>
                  <span :class="`text-xs px-2 py-1 rounded-full uppercase ${getSeverityColor(alert.severity)}`">
                    {{ alert.severity }}
                  </span>
                </div>
                <p class="text-sm mt-1 opacity-90">{{ alert.message }}</p>

                <div v-if="alert.action" class="mt-3 flex items-center gap-2">
                  <span class="text-sm font-medium">Recommended Action:</span>
                  <span class="text-sm opacity-80">{{ alert.action }}</span>
                </div>

                <div class="mt-3 flex items-center gap-3">
                  <button 
                    @click="acknowledgeAlert(alert.id)"
                    class="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all"
                  >
                    <CheckCircle2 class="w-4 h-4" />
                    Acknowledge
                  </button>
                  <span class="text-xs opacity-60">
                    {{ new Date(alert.timestamp).toLocaleTimeString() }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="unacknowledgedAlerts.length === 0" class="text-center py-8 bg-slate-800/50 rounded-xl border border-slate-700 border-dashed">
          <CheckCircle2 class="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <p class="text-white font-medium">All caught up!</p>
          <p class="text-sm text-slate-400">No active alerts requiring attention</p>
        </div>
      </div>
    </div>

    <!-- Alert History -->
    <div v-if="acknowledgedAlerts.length > 0">
      <h3 class="text-xl font-bold text-slate-400 mb-4">Alert History ({{ acknowledgedAlerts.length }})</h3>

      <div class="space-y-2">
        <div 
          v-for="alert in acknowledgedAlerts" 
          :key="alert.id"
          class="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 opacity-60"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <component :is="getAlertTypeIcon(alert.type)" class="w-4 h-4 text-slate-500" />
              <span class="text-slate-300">{{ alert.title }}</span>
            </div>
            <span class="text-xs text-slate-500">
              {{ new Date(alert.timestamp).toLocaleDateString() }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Disclaimer -->
    <div class="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
      <div class="flex items-start gap-3">
        <Info class="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
        <p class="text-sm text-slate-400">
          These predictions are based on AI analysis of your glucose patterns and should be used as guidance only. 
          Always consult your healthcare provider for medical decisions. In case of emergency, seek immediate medical attention.
        </p>
      </div>
    </div>
  </div>
</template>
