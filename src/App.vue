<script setup lang="ts">
import { ref, computed } from 'vue'
import { 
  LayoutDashboard, 
  Utensils, 
  Bell, 
  TrendingUp, 
  Menu,
  X,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'
import Dashboard from './views/Dashboard.vue'
import MealPlanner from './views/MealPlanner.vue'
import AlertsPanel from './views/AlertsPanel.vue'
import FoodDatabase from './views/FoodDatabase.vue'

const activeTab = ref('dashboard')
const sidebarOpen = ref(false) // Start closed on mobile
const isMobile = ref(window.innerWidth < 1024)

// Auto-detect mobile
window.addEventListener('resize', () => {
  isMobile.value = window.innerWidth < 1024
  if (isMobile.value) {
    sidebarOpen.value = false
  }
})

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'meal-planner', label: 'Meal Planner', icon: Utensils },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'food-db', label: 'Food DB', icon: TrendingUp },
]

const currentView = computed(() => {
  switch (activeTab.value) {
    case 'dashboard': return Dashboard
    case 'meal-planner': return MealPlanner
    case 'alerts': return AlertsPanel
    case 'food-db': return FoodDatabase
    default: return Dashboard
  }
})

function selectTab(id: string) {
  activeTab.value = id
  if (isMobile.value) {
    sidebarOpen.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-slate-100 flex">
    <!-- Mobile Sidebar Overlay -->
    <div 
      v-if="sidebarOpen && isMobile" 
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- Sidebar -->
    <aside 
      :class="[
        'bg-slate-800 border-r border-slate-700 transition-all duration-300 flex flex-col z-50',
        isMobile 
          ? sidebarOpen ? 'fixed inset-y-0 left-0 w-72' : 'fixed inset-y-0 left-0 w-0 overflow-hidden'
          : sidebarOpen ? 'w-64' : 'w-20'
      ]"
    >
      <!-- Logo -->
      <div class="p-4 lg:p-6 border-b border-slate-700 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <span class="text-white font-bold text-lg">G</span>
          </div>
          <div v-if="sidebarOpen || isMobile" class="min-w-0">
            <h1 class="font-bold text-lg text-white truncate">GlucoGuard</h1>
            <p class="text-xs text-slate-400">AI Health</p>
          </div>
        </div>
        <!-- Close button for mobile -->
        <button 
          v-if="isMobile && sidebarOpen" 
          @click="sidebarOpen = false"
          class="p-2 text-slate-400 hover:text-white lg:hidden"
        >
          <X :size="24" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-3 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto">
        <button
          v-for="item in menuItems"
          :key="item.id"
          @click="selectTab(item.id)"
          :class="[
            'w-full flex items-center gap-3 px-3 lg:px-4 py-3 rounded-xl transition-all min-h-[48px]',
            activeTab === item.id 
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
          ]"
        >
          <component :is="item.icon" :size="20" class="flex-shrink-0" />
          <span v-if="sidebarOpen || isMobile" class="font-medium text-sm lg:text-base truncate">{{ item.label }}</span>
        </button>
      </nav>

      <!-- Desktop Toggle -->
      <button
        v-if="!isMobile"
        @click="sidebarOpen = !sidebarOpen"
        class="p-4 border-t border-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
      >
        <ChevronLeft v-if="sidebarOpen" :size="20" />
        <ChevronRight v-else :size="20" />
      </button>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-w-0">
      <!-- Top Bar -->
      <header class="h-14 lg:h-16 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between px-3 lg:px-6">
        <div class="flex items-center gap-3">
          <!-- Mobile Menu Button -->
          <button 
            @click="sidebarOpen = true"
            class="p-2 text-slate-400 hover:text-white lg:hidden"
          >
            <Menu :size="24" />
          </button>
          <h2 class="text-lg lg:text-xl font-semibold text-white truncate">
            {{ menuItems.find(item => item.id === activeTab)?.label }}
          </h2>
        </div>
        
        <div class="flex items-center gap-2 lg:gap-4">
          <button class="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50">
            <Bell :size="20" />
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div class="flex items-center gap-2 lg:gap-3 pl-2 lg:pl-4 border-l border-slate-700">
            <div class="text-right hidden sm:block">
              <p class="text-sm font-medium text-white">Patient Demo</p>
              <p class="text-xs text-slate-400">Type 2 Diabetes</p>
            </div>
            <div class="w-9 h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
              <User :size="18" class="text-white" />
            </div>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <div class="flex-1 overflow-auto p-3 lg:p-6">
        <component :is="currentView" />
      </div>
    </main>
  </div>
</template>
