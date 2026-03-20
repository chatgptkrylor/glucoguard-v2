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
  Shield
} from 'lucide-vue-next'
import {
  predictHypoglycemia,
  predictHyperglycemia,
  analyzeGlucosePatterns,
  Alert,
  Pattern
} from '../ai/predictiveAlerts'

/* Mock data */
const mockReadings = ref([
  { value: 140, timestamp: new Date(Date.now() - 3600000 * 8), mealContext: 'fasting' as const },
  { value: 180, timestamp: new Date(Date.now() - 3600000 * 6), mealContext: 'after_meal' as const },
  { value: 160, timestamp: new Date(Date.now() - 3600000 * 4), mealContext: 'before_meal' as const },
  { value: 200, timestamp: new Date(Date.now() - 3600000 * 2), mealContext: 'after_meal' as const },
  { value: 140, timestamp: new Date(), mealContext: 'before_meal' as const },
])

const currentGlucose    = ref(140)
const timeSinceLastMeal = ref(4)

const hypoglycemiaRisk  = computed(() => predictHypoglycemia(mockReadings.value, currentGlucose.value, timeSinceLastMeal.value))
const hyperglycemiaRisk = computed(() => predictHyperglycemia(mockReadings.value, currentGlucose.value))
const patterns          = computed(() => analyzeGlucosePatterns(mockReadings.value))

const alerts = ref<Alert[]>([
  {
    id: '1',
    type: 'hypoglycemia',
    severity: 'warning',
    title: 'Hypoglycemia Risk Detected',
    message: 'Based on your recent readings and time since last meal, you may experience low blood sugar within the next 2 hours.',
    timestamp: new Date(),
    action: 'Consider having a snack with 15–20g of carbohydrates now.',
    acknowledged: false
  },
  {
    id: '2',
    type: 'pattern',
    severity: 'info',
    title: 'Post-Meal Spike Pattern',
    message: 'Your glucose consistently rises 40–60 mg/dL after meals. Consider smaller portions or lower GI foods.',
    timestamp: new Date(Date.now() - 3600000 * 2),
    action: 'Review meal composition in Meal Planner.',
    acknowledged: false
  },
  {
    id: '3',
    type: 'lifestyle',
    severity: 'info',
    title: 'Evening Glucose Trend',
    message: 'Your evening readings have been 15% higher than morning. This could indicate dawn phenomenon.',
    timestamp: new Date(Date.now() - 3600000 * 24),
    action: 'Monitor bedtime snacks and medication timing.',
    acknowledged: true
  }
])

const unacknowledgedAlerts = computed(() => alerts.value.filter(a => !a.acknowledged))
const acknowledgedAlerts   = computed(() => alerts.value.filter(a => a.acknowledged))

function acknowledgeAlert(id: string) {
  const a = alerts.value.find(a => a.id === id)
  if (a) a.acknowledged = true
}

function getAlertTypeIcon(type: string) {
  return { hypoglycemia: TrendingDown, hyperglycemia: TrendingUp, pattern: Activity }[type] ?? Bell
}

function getRiskLabel(risk: string) {
  return { high: 'High', medium: 'Medium', low: 'Low' }[risk] ?? risk
}

function getRiskBadgeClass(risk: string) {
  return { high: 'badge-danger', medium: 'badge-warning', low: 'badge-success' }[risk] ?? 'badge-info'
}

function getRiskBarClass(risk: string) {
  return { high: 'progress-red', medium: 'progress-amber', low: 'progress-green' }[risk] ?? 'progress-teal'
}

const patternEmoji: Record<string, string> = {
  dawn_phenomenon: '🌅',
  post_meal_spike: '🍽️',
  nighttime_low:   '🌙',
  morning_high:    '☀️',
}
</script>

<template>
  <div class="space-y-6">

    <!-- ── Header ── -->
    <div class="card-premium">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-11 h-11 rounded-2xl flex items-center justify-center" style="background:#fee2e2;color:#b91c1c;">
          <Bell class="w-5 h-5" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-stone-800 tracking-tight">AI Predictive Alerts</h2>
          <p class="text-stone-400 text-sm">Real-time glucose risk analysis and pattern detection</p>
        </div>
      </div>

      <div v-if="unacknowledgedAlerts.length > 0" class="flex items-center gap-2 mt-2">
        <span class="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
        <span class="text-red-600 font-medium text-sm">
          {{ unacknowledgedAlerts.length }} active alert{{ unacknowledgedAlerts.length !== 1 ? 's' : '' }} requiring attention
        </span>
      </div>
      <div v-else class="flex items-center gap-2 mt-2">
        <CheckCircle2 class="w-4 h-4 text-emerald-500" />
        <span class="text-emerald-700 font-medium text-sm">All clear — no active alerts</span>
      </div>
    </div>

    <!-- ── Risk Dashboard ── -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

      <!-- Hypoglycemia Risk -->
      <div class="card">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#dbeafe;color:#1d4ed8;">
            <TrendingDown class="w-4.5 h-4.5" style="width:18px;height:18px" />
          </div>
          <div>
            <h3 class="font-semibold text-stone-800 text-sm">Hypoglycemia Risk</h3>
            <p class="text-xs text-stone-400">Low blood sugar</p>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-stone-500 text-sm">Risk Level</span>
            <span :class="['badge', getRiskBadgeClass(hypoglycemiaRisk.risk)]">
              {{ getRiskLabel(hypoglycemiaRisk.risk) }}
            </span>
          </div>

          <div class="progress-track">
            <div :class="getRiskBarClass(hypoglycemiaRisk.risk)" :style="`width:${Math.round(hypoglycemiaRisk.confidence * 100)}%`" />
          </div>

          <div class="flex items-center justify-between text-sm">
            <span class="text-stone-500">Confidence</span>
            <span class="text-stone-800 font-semibold">{{ Math.round(hypoglycemiaRisk.confidence * 100) }}%</span>
          </div>

          <div v-if="hypoglycemiaRisk.predictedTime" class="flex items-center gap-2 p-3 rounded-xl" style="background:#eff6ff;">
            <Clock class="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span class="text-xs text-blue-700 font-medium">
              Predicted in {{ Math.round((hypoglycemiaRisk.predictedTime.getTime() - Date.now()) / 60000) }} min
            </span>
          </div>
        </div>
      </div>

      <!-- Hyperglycemia Risk -->
      <div class="card">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#fee2e2;color:#b91c1c;">
            <TrendingUp class="w-4.5 h-4.5" style="width:18px;height:18px" />
          </div>
          <div>
            <h3 class="font-semibold text-stone-800 text-sm">Hyperglycemia Risk</h3>
            <p class="text-xs text-stone-400">High blood sugar</p>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-stone-500 text-sm">Risk Level</span>
            <span :class="['badge', getRiskBadgeClass(hyperglycemiaRisk.risk)]">
              {{ getRiskLabel(hyperglycemiaRisk.risk) }}
            </span>
          </div>

          <div class="progress-track">
            <div :class="getRiskBarClass(hyperglycemiaRisk.risk)" :style="`width:${Math.round(hyperglycemiaRisk.confidence * 100)}%`" />
          </div>

          <div class="flex items-center justify-between text-sm">
            <span class="text-stone-500">Confidence</span>
            <span class="text-stone-800 font-semibold">{{ Math.round(hyperglycemiaRisk.confidence * 100) }}%</span>
          </div>

          <div class="flex items-center gap-2 p-3 rounded-xl" style="background:#fef2f2;">
            <Activity class="w-4 h-4 text-red-400 flex-shrink-0" />
            <span class="text-xs text-red-700 font-medium">{{ hyperglycemiaRisk.trend }}</span>
          </div>
        </div>
      </div>

      <!-- Detected Patterns -->
      <div class="card">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#ede9fe;color:#7c3aed;">
            <Activity class="w-4.5 h-4.5" style="width:18px;height:18px" />
          </div>
          <div>
            <h3 class="font-semibold text-stone-800 text-sm">Detected Patterns</h3>
            <p class="text-xs text-stone-400">{{ patterns.length }} pattern{{ patterns.length !== 1 ? 's' : '' }} found</p>
          </div>
        </div>

        <div class="space-y-2.5">
          <div
            v-for="(pattern, i) in patterns.slice(0, 3)"
            :key="i"
            class="p-3 rounded-xl"
            style="background:#fafaf9;border:1px solid #e7e5e4;"
          >
            <div class="flex items-center gap-2 mb-1">
              <span class="text-base">{{ patternEmoji[pattern.type] || '📊' }}</span>
              <span class="font-semibold text-stone-700 text-xs capitalize">
                {{ pattern.type.replace(/_/g, ' ') }}
              </span>
            </div>
            <p class="text-xs text-stone-500 leading-snug">{{ pattern.description }}</p>
            <div class="mt-2 flex items-center justify-between">
              <span class="text-xs font-semibold text-purple-600">{{ Math.round(pattern.confidence * 100) }}% confidence</span>
              <span class="text-xs text-stone-400">{{ pattern.occurrence }}× detected</span>
            </div>
          </div>

          <div v-if="patterns.length === 0" class="text-center py-4">
            <p class="text-stone-500 text-sm">No patterns detected yet</p>
            <p class="text-xs text-stone-400 mt-1">Add more readings for analysis</p>
          </div>
        </div>
      </div>

    </div>

    <!-- ── Active Alerts ── -->
    <div>
      <div class="flex items-center gap-2 mb-4">
        <span class="w-2 h-2 rounded-full bg-red-500" :class="unacknowledgedAlerts.length > 0 ? 'animate-pulse' : ''" />
        <h3 class="section-title">Active Alerts ({{ unacknowledgedAlerts.length }})</h3>
      </div>

      <div class="space-y-3">
        <div
          v-for="alert in unacknowledgedAlerts"
          :key="alert.id"
          :class="['alert-card', `alert-card--${alert.severity}`]"
        >
          <div class="flex items-start gap-3">
            <div :class="['alert-icon', `alert-icon--${alert.severity}`]">
              <component :is="getAlertTypeIcon(alert.type)" class="w-4 h-4" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-2">
                <h4 class="font-semibold text-stone-800 text-sm">{{ alert.title }}</h4>
                <span :class="['badge flex-shrink-0', alert.severity === 'warning' ? 'badge-warning' : 'badge-info']">
                  {{ alert.severity }}
                </span>
              </div>
              <p class="text-sm text-stone-600 mt-1 leading-relaxed">{{ alert.message }}</p>

              <div v-if="alert.action" class="mt-2.5 flex items-start gap-1.5">
                <div class="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 flex-shrink-0" />
                <p class="text-xs text-stone-500"><span class="font-semibold text-stone-600">Action: </span>{{ alert.action }}</p>
              </div>

              <div class="mt-3 flex items-center gap-3">
                <button
                  @click="acknowledgeAlert(alert.id)"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                  style="background:#f0fdf4;color:#15803d;border:1px solid rgba(34,197,94,0.2);"
                >
                  <CheckCircle2 class="w-3.5 h-3.5" />
                  Acknowledge
                </button>
                <span class="text-xs text-stone-400">{{ new Date(alert.timestamp).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-if="unacknowledgedAlerts.length === 0"
          class="flex flex-col items-center py-12 rounded-2xl border-2 border-dashed border-stone-200"
          style="background:#fafaf9;"
        >
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style="background:#dcfce7;">
            <CheckCircle2 class="w-7 h-7 text-emerald-500" />
          </div>
          <p class="text-stone-700 font-semibold">All caught up!</p>
          <p class="text-stone-400 text-sm mt-1">No active alerts requiring attention</p>
        </div>
      </div>
    </div>

    <!-- ── Alert History ── -->
    <div v-if="acknowledgedAlerts.length > 0">
      <h3 class="section-title mb-3 text-stone-400">Alert History ({{ acknowledgedAlerts.length }})</h3>
      <div class="space-y-2">
        <div
          v-for="alert in acknowledgedAlerts"
          :key="alert.id"
          class="flex items-center justify-between px-4 py-3 rounded-xl"
          style="background:#fafaf9;border:1px solid #e7e5e4;opacity:0.7;"
        >
          <div class="flex items-center gap-2.5">
            <component :is="getAlertTypeIcon(alert.type)" class="w-4 h-4 text-stone-300" />
            <span class="text-stone-500 text-sm">{{ alert.title }}</span>
          </div>
          <span class="text-xs text-stone-400">
            {{ new Date(alert.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
          </span>
        </div>
      </div>
    </div>

    <!-- ── Medical Disclaimer ── -->
    <div class="card" style="background:#fafaf9;border-color:#e7e5e4;">
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style="background:#dbeafe;color:#1d4ed8;">
          <Shield class="w-4 h-4" />
        </div>
        <p class="text-stone-500 text-sm leading-relaxed">
          These predictions are based on AI analysis of your glucose patterns and should be used as guidance only.
          <span class="font-semibold text-stone-600">Always consult your healthcare provider</span> for medical decisions.
          In case of emergency, seek immediate medical attention.
        </p>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Alert cards */
.alert-card {
  background: white;
  border-radius: 16px;
  padding: 1.125rem;
  border-left: 4px solid;
  border-top: 1px solid;
  border-right: 1px solid;
  border-bottom: 1px solid;
  transition: box-shadow 0.2s ease;
}

.alert-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}

.alert-card--warning {
  border-left-color: #f59e0b;
  border-color: rgba(245,158,11,0.2);
  border-left-color: #f59e0b;
  background: #fffbeb;
}

.alert-card--info {
  border-left-color: #3b82f6;
  border-color: rgba(59,130,246,0.15);
  border-left-color: #3b82f6;
  background: #eff6ff;
}

.alert-card--critical {
  border-left-color: #ef4444;
  border-color: rgba(239,68,68,0.15);
  border-left-color: #ef4444;
  background: #fef2f2;
}

/* Alert icon containers */
.alert-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-icon--warning  { background: #fef3c7; color: #b45309; }
.alert-icon--info     { background: #dbeafe; color: #1d4ed8; }
.alert-icon--critical { background: #fee2e2; color: #b91c1c; }
</style>
