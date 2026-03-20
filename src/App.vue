<script setup lang="ts">
import { ref } from 'vue'
import {
  LayoutDashboard,
  UtensilsCrossed,
  Bell,
  Search,
  Menu,
  X,
  Droplets,
  User,
  ChevronRight,
} from 'lucide-vue-next'
import Dashboard from './views/Dashboard.vue'
import MealPlanner from './views/MealPlanner.vue'
import AlertsPanel from './views/AlertsPanel.vue'
import FoodDatabase from './views/FoodDatabase.vue'

type TabId = 'dashboard' | 'meals' | 'alerts' | 'foods'

const activeTab = ref<TabId>('dashboard')
const sidebarOpen = ref(false)

const navItems = [
  { id: 'dashboard' as TabId, label: 'Dashboard', shortLabel: 'Home', icon: LayoutDashboard },
  { id: 'meals' as TabId, label: 'Meal Planner', shortLabel: 'Meals', icon: UtensilsCrossed },
  { id: 'alerts' as TabId, label: 'Health Alerts', shortLabel: 'Alerts', icon: Bell },
  { id: 'foods' as TabId, label: 'Food Database', shortLabel: 'Foods', icon: Search },
]

function setTab(id: TabId) {
  activeTab.value = id
  sidebarOpen.value = false
}
</script>

<template>
  <!-- Mobile sidebar overlay -->
  <Transition name="fade">
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/40 z-40 lg:hidden"
      @click="sidebarOpen = false"
    />
  </Transition>

  <div class="flex h-screen overflow-hidden" style="background: #fafaf9;">

    <!-- ── Sidebar ── -->
    <aside
      class="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 lg:translate-x-0 shadow-lg lg:shadow-none"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
    >
      <!-- Logo -->
      <div class="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
        <div class="w-9 h-9 bg-teal-500 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
          <Droplets class="w-5 h-5 text-white" />
        </div>
        <div class="min-w-0">
          <p class="text-sm font-bold text-gray-900 leading-tight">GlucoGuard AI</p>
          <p class="text-[11px] text-teal-600 font-medium">Diabetes Management</p>
        </div>
        <button class="ml-auto lg:hidden p-1 text-gray-400 hover:text-gray-600" @click="sidebarOpen = false">
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Patient card -->
      <div class="mx-3 mt-3 mb-1 bg-teal-50 rounded-xl p-3 border border-teal-100">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User class="w-4 h-4 text-teal-600" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-gray-900 truncate">Rajesh Kumar</p>
            <p class="text-[11px] text-gray-500">Type 2 Diabetes · 45 yrs</p>
          </div>
          <ChevronRight class="w-4 h-4 text-teal-400 flex-shrink-0" />
        </div>
        <div class="flex gap-2 mt-2">
          <span class="text-[10px] bg-white text-teal-700 border border-teal-200 rounded-full px-2 py-0.5 font-medium">Metformin 500mg</span>
          <span class="text-[10px] bg-white text-amber-700 border border-amber-200 rounded-full px-2 py-0.5 font-medium">HbA1c: 7.2%</span>
        </div>
      </div>

      <!-- Nav -->
      <nav class="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        <button
          v-for="item in navItems"
          :key="item.id"
          @click="setTab(item.id)"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 min-h-[44px]"
          :class="activeTab === item.id
            ? 'bg-teal-500 text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
        >
          <component :is="item.icon" class="w-[18px] h-[18px] flex-shrink-0" />
          <span>{{ item.label }}</span>
          <span
            v-if="item.id === 'alerts'"
            class="ml-auto text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0"
            :class="activeTab === 'alerts' ? 'bg-white/20 text-white' : 'bg-red-500 text-white'"
          >2</span>
        </button>
      </nav>

      <!-- Footer -->
      <div class="px-4 py-3 border-t border-gray-100">
        <p class="text-[11px] text-gray-400 text-center">Demo · Dr. Nadeem Rais · Mar 24, 2026</p>
      </div>
    </aside>

    <!-- ── Main ── -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden">

      <!-- Mobile header -->
      <header class="lg:hidden bg-white border-b border-gray-100 h-14 px-4 flex items-center justify-between flex-shrink-0">
        <button
          @click="sidebarOpen = true"
          class="p-2 -ml-2 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <Menu class="w-5 h-5" />
        </button>
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 bg-teal-500 rounded-lg flex items-center justify-center">
            <Droplets class="w-4 h-4 text-white" />
          </div>
          <span class="text-sm font-bold text-gray-900">GlucoGuard AI</span>
        </div>
        <div class="w-9 h-9 bg-teal-50 rounded-full flex items-center justify-center">
          <User class="w-4 h-4 text-teal-600" />
        </div>
      </header>

      <!-- View content -->
      <main class="flex-1 overflow-y-auto pb-20 lg:pb-0">
        <Dashboard v-if="activeTab === 'dashboard'" />
        <MealPlanner v-else-if="activeTab === 'meals'" />
        <AlertsPanel v-else-if="activeTab === 'alerts'" />
        <FoodDatabase v-else-if="activeTab === 'foods'" />
      </main>
    </div>
  </div>

  <!-- ── Mobile bottom nav ── -->
  <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30 safe-area-inset-bottom">
    <div class="flex">
      <button
        v-for="item in navItems"
        :key="item.id"
        @click="setTab(item.id)"
        class="flex-1 flex flex-col items-center justify-center py-2 gap-1 min-h-[56px] relative"
        :class="activeTab === item.id ? 'text-teal-600' : 'text-gray-400'"
      >
        <span
          v-if="activeTab === item.id"
          class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-teal-500 rounded-b-full"
        />
        <component :is="item.icon" class="w-5 h-5" />
        <span class="text-[10px] font-medium">{{ item.shortLabel }}</span>
        <span
          v-if="item.id === 'alerts' && activeTab !== 'alerts'"
          class="absolute top-1.5 right-1/4 bg-red-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center"
        >2</span>
      </button>
    </div>
  </nav>
</template>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
