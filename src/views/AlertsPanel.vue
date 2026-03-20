<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Bell,
  TrendingUp,
  Moon,
  Sun,
  Zap,
  Clock,
} from 'lucide-vue-next'

interface LocalAlert {
  id: string
  type: 'hypoglycemia' | 'hyperglycemia' | 'pattern' | 'medication' | 'lifestyle'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  time: string
  action?: string
  acknowledged: boolean
}

interface LocalPattern {
  id: string
  type: string
  title: string
  description: string
  confidence: number
  occurrences: number
  recommendation: string
  iconName: 'sun' | 'moon' | 'trendingUp' | 'zap'
}

const alerts = ref<LocalAlert[]>([
  {
    id: '1',
    type: 'hypoglycemia',
    severity: 'critical',
    title: 'Low Glucose Risk',
    message: 'Glucose dropped to 65 mg/dL at 3:30 AM. You have had 2 nighttime lows this week.',
    time: '3:30 AM today',
    action: 'Have 15g fast-acting carbs (glucose tablet, juice, or candy). Recheck in 15 min.',
    acknowledged: false,
  },
  {
    id: '2',
    type: 'pattern',
    severity: 'high',
    title: 'Dawn Phenomenon Alert',
    message: 'Morning glucose consistently 30+ mg/dL higher than bedtime. Detected 5 days in a row.',
    time: '7:00 AM today',
    action: 'Discuss adjusting bedtime insulin or medication timing with Dr. Rais.',
    acknowledged: false,
  },
  {
    id: '3',
    type: 'hyperglycemia',
    severity: 'medium',
    title: 'Post-Lunch Spike',
    message: 'Glucose reached 215 mg/dL after lunch — 35 mg/dL above your usual pattern.',
    time: '2:30 PM yesterday',
    action: 'Consider a 15-20 min walk after lunch. Choose lower GI foods for tomorrow.',
    acknowledged: false,
  },
  {
    id: '4',
    type: 'medication',
    severity: 'low',
    title: 'Medication Reminder',
    message: 'Metformin 500mg due with dinner. Consistent timing improves drug effectiveness by ~15%.',
    time: '6:00 PM today',
    action: 'Take with or immediately after dinner.',
    acknowledged: true,
  },
  {
    id: '5',
    type: 'lifestyle',
    severity: 'low',
    title: 'Exercise Streak',
    message: 'No exercise logged in 3 days. Regular walking significantly improves insulin sensitivity.',
    time: '10:00 AM today',
    action: 'A 15-30 min brisk walk today can reduce your glucose by 20-40 mg/dL.',
    acknowledged: true,
  },
])

const patterns = ref<LocalPattern[]>([
  {
    id: 'p1',
    type: 'dawn_phenomenon',
    title: 'Dawn Phenomenon',
    description: 'Morning glucose rises 30+ mg/dL between 4–8 AM on 5 of the last 7 days.',
    confidence: 85,
    occurrences: 5,
    recommendation: 'Long-acting insulin at bedtime, or discuss medication adjustment with your doctor.',
    iconName: 'sun',
  },
  {
    id: 'p2',
    type: 'post_meal_spike',
    title: 'Post-Meal Spikes',
    description: '60% of readings after lunch are above 180 mg/dL — primarily high-GI foods.',
    confidence: 72,
    occurrences: 8,
    recommendation: 'Eat vegetables and protein before carbs. Consider smaller portions of rice/roti.',
    iconName: 'trendingUp',
  },
  {
    id: 'p3',
    type: 'nighttime_low',
    title: 'Nighttime Lows',
    description: 'Glucose falls below 80 mg/dL 2 nights per week between 2–4 AM.',
    confidence: 68,
    occurrences: 3,
    recommendation: 'Small protein snack before bed (eg: 1 boiled egg or handful of nuts).',
    iconName: 'moon',
  },
])

const activeTab = ref<'active' | 'acknowledged' | 'patterns'>('active')

const activeAlerts = computed(() => alerts.value.filter(a => !a.acknowledged))
const acknowledgedAlerts = computed(() => alerts.value.filter(a => a.acknowledged))

function acknowledge(id: string) {
  const alert = alerts.value.find(a => a.id === id)
  if (alert) alert.acknowledged = true
  if (activeAlerts.value.length === 0) activeTab.value = 'acknowledged'
}

function severityConfig(severity: LocalAlert['severity']) {
  switch (severity) {
    case 'critical':
      return {
        border: 'border-l-red-500',
        bg: 'bg-red-50',
        badge: 'bg-red-100 text-red-700',
        icon: AlertCircle,
        iconColor: 'text-red-500',
        label: 'Critical',
      }
    case 'high':
      return {
        border: 'border-l-orange-500',
        bg: 'bg-orange-50',
        badge: 'bg-orange-100 text-orange-700',
        icon: AlertTriangle,
        iconColor: 'text-orange-500',
        label: 'High',
      }
    case 'medium':
      return {
        border: 'border-l-amber-400',
        bg: 'bg-amber-50',
        badge: 'bg-amber-100 text-amber-700',
        icon: AlertTriangle,
        iconColor: 'text-amber-500',
        label: 'Medium',
      }
    default:
      return {
        border: 'border-l-blue-400',
        bg: 'bg-blue-50',
        badge: 'bg-blue-100 text-blue-700',
        icon: Info,
        iconColor: 'text-blue-400',
        label: 'Info',
      }
  }
}

const patternIcons = {
  sun: Sun,
  moon: Moon,
  trendingUp: TrendingUp,
  zap: Zap,
}
</script>

<template>
  <div class="px-4 py-5 max-w-4xl mx-auto space-y-4 lg:px-6 lg:py-6">

    <!-- Header -->
    <div class="flex items-start justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold text-gray-900">Health Alerts</h2>
        <p class="text-sm text-gray-500 mt-0.5">Predictive alerts and glucose patterns</p>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-red-50 rounded-full flex items-center justify-center">
          <Bell class="w-4 h-4 text-red-500" />
        </div>
        <span class="text-sm font-bold text-red-600">{{ activeAlerts.length }} Active</span>
      </div>
    </div>

    <!-- Risk Summary -->
    <div class="grid grid-cols-3 gap-3">
      <div class="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
        <p class="text-2xl font-bold text-red-600">{{ activeAlerts.filter(a => a.severity === 'critical' || a.severity === 'high').length }}</p>
        <p class="text-xs text-gray-500 mt-0.5">High Risk</p>
      </div>
      <div class="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
        <p class="text-2xl font-bold text-amber-600">{{ activeAlerts.filter(a => a.severity === 'medium').length }}</p>
        <p class="text-xs text-gray-500 mt-0.5">Medium</p>
      </div>
      <div class="bg-white rounded-xl p-3 border border-gray-100 shadow-sm text-center">
        <p class="text-2xl font-bold text-teal-600">{{ patterns.length }}</p>
        <p class="text-xs text-gray-500 mt-0.5">Patterns</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 bg-gray-100 rounded-xl p-1">
      <button
        @click="activeTab = 'active'"
        class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
        :class="activeTab === 'active' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'"
      >
        Active
        <span v-if="activeAlerts.length > 0" class="bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {{ activeAlerts.length }}
        </span>
      </button>
      <button
        @click="activeTab = 'acknowledged'"
        class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
        :class="activeTab === 'acknowledged' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'"
      >
        Resolved
      </button>
      <button
        @click="activeTab = 'patterns'"
        class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1.5"
        :class="activeTab === 'patterns' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'"
      >
        Patterns
        <span class="bg-teal-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          {{ patterns.length }}
        </span>
      </button>
    </div>

    <!-- Active Alerts -->
    <div v-if="activeTab === 'active'" class="space-y-3">
      <div v-if="activeAlerts.length === 0" class="bg-green-50 rounded-2xl border border-green-100 p-6 text-center">
        <CheckCircle class="w-10 h-10 text-green-400 mx-auto mb-2" />
        <p class="text-green-800 font-semibold">All clear!</p>
        <p class="text-sm text-green-600 mt-1">No active alerts right now. Keep up the great work.</p>
      </div>

      <div
        v-for="alert in activeAlerts"
        :key="alert.id"
        class="bg-white rounded-2xl shadow-sm overflow-hidden border border-l-4"
        :class="[severityConfig(alert.severity).border, 'border-gray-100']"
      >
        <div class="p-4">
          <div class="flex items-start gap-3">
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              :class="severityConfig(alert.severity).bg"
            >
              <component :is="severityConfig(alert.severity).icon" class="w-4 h-4" :class="severityConfig(alert.severity).iconColor" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="text-sm font-bold text-gray-900">{{ alert.title }}</h3>
                    <span class="text-[10px] font-semibold rounded-full px-2 py-0.5" :class="severityConfig(alert.severity).badge">
                      {{ severityConfig(alert.severity).label }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                    <Clock class="w-3 h-3" /> {{ alert.time }}
                  </p>
                </div>
              </div>
              <p class="text-sm text-gray-700 mt-2 leading-relaxed">{{ alert.message }}</p>

              <div v-if="alert.action" class="mt-2.5 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                <p class="text-xs font-semibold text-gray-500 mb-0.5">Recommended Action</p>
                <p class="text-xs text-gray-700">{{ alert.action }}</p>
              </div>
            </div>
          </div>
          <div class="flex gap-2 mt-3">
            <button
              @click="acknowledge(alert.id)"
              class="flex-1 bg-gray-900 hover:bg-gray-700 text-white text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <CheckCircle class="w-3.5 h-3.5" />
              Mark Resolved
            </button>
            <button class="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium rounded-xl transition-colors min-h-[44px]">
              Snooze
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Acknowledged Alerts -->
    <div v-if="activeTab === 'acknowledged'" class="space-y-3">
      <div v-if="acknowledgedAlerts.length === 0" class="bg-white rounded-2xl border border-gray-100 p-6 text-center text-gray-400">
        No resolved alerts yet.
      </div>
      <div
        v-for="alert in acknowledgedAlerts"
        :key="alert.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 opacity-60"
      >
        <div class="flex items-center gap-3">
          <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0" />
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-gray-700 truncate">{{ alert.title }}</p>
            <p class="text-xs text-gray-400">{{ alert.time }}</p>
          </div>
          <span class="text-[10px] bg-green-50 text-green-600 rounded-full px-2 py-0.5 font-medium flex-shrink-0">Resolved</span>
        </div>
      </div>
    </div>

    <!-- Patterns -->
    <div v-if="activeTab === 'patterns'" class="space-y-3">
      <div class="p-3 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-2">
        <Info class="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <p class="text-xs text-blue-700">Patterns are detected from your last 7 days of glucose data using AI analysis.</p>
      </div>

      <div
        v-for="pattern in patterns"
        :key="pattern.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
      >
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <component :is="patternIcons[pattern.iconName]" class="w-5 h-5 text-teal-600" />
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-2">
              <h3 class="text-sm font-bold text-gray-900">{{ pattern.title }}</h3>
              <span class="text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-2 py-0.5 flex-shrink-0">
                {{ pattern.confidence }}% confidence
              </span>
            </div>
            <p class="text-xs text-gray-500 mt-0.5">{{ pattern.occurrences }} occurrences detected</p>
            <p class="text-sm text-gray-700 mt-2 leading-relaxed">{{ pattern.description }}</p>

            <!-- Confidence bar -->
            <div class="mt-3">
              <div class="flex items-center justify-between mb-1">
                <span class="text-xs text-gray-500">Confidence</span>
                <span class="text-xs font-semibold text-gray-700">{{ pattern.confidence }}%</span>
              </div>
              <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-teal-500 rounded-full transition-all"
                  :style="{ width: pattern.confidence + '%' }"
                />
              </div>
            </div>

            <div class="mt-3 p-2.5 bg-teal-50 rounded-xl border border-teal-100">
              <p class="text-xs font-semibold text-teal-800 mb-0.5">Recommendation</p>
              <p class="text-xs text-teal-700 leading-relaxed">{{ pattern.recommendation }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Doctor summary -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <Info class="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <p class="text-sm font-semibold text-gray-900">For Dr. Nadeem Rais</p>
          <p class="text-xs text-gray-500">Demo · Tuesday March 24, 2026</p>
        </div>
      </div>
      <div class="space-y-2 text-xs text-gray-600">
        <p>• <strong>Key concern:</strong> Dawn phenomenon with 30+ mg/dL morning spikes, 5 of last 7 days</p>
        <p>• <strong>Positive:</strong> Post-meal glucose improving — 15% reduction this week</p>
        <p>• <strong>Action needed:</strong> Review bedtime medication and consider CGM upgrade</p>
      </div>
    </div>

  </div>
</template>
