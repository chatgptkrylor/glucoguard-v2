<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  LayoutDashboard, 
  Utensils, 
  Bell, 
  Database,
  Menu,
  X,
  User,
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles
} from 'lucide-vue-next'
import Dashboard from './views/Dashboard.vue'
import MealPlanner from './views/MealPlanner.vue'
import AlertsPanel from './views/AlertsPanel.vue'
import FoodDatabase from './views/FoodDatabase.vue'

const activeTab = ref('dashboard')
const sidebarOpen = ref(true)
const isMobile = ref(false)
const isLoaded = ref(false)

// Handle resize for responsive design
const handleResize = () => {
  const wasMobile = isMobile.value
  isMobile.value = window.innerWidth < 1024
  
  if (isMobile.value !== wasMobile) {
    sidebarOpen.value = !isMobile.value
  }
}

onMounted(() => {
  isMobile.value = window.innerWidth < 1024
  sidebarOpen.value = !isMobile.value
  
  window.addEventListener('resize', handleResize)
  
  // Trigger entrance animation
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
  
  return () => window.removeEventListener('resize', handleResize)
})

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'from-teal-400 to-cyan-500' },
  { id: 'meal-planner', label: 'Meal Planner', icon: Utensils, color: 'from-orange-400 to-rose-500' },
  { id: 'alerts', label: 'Health Alerts', icon: Bell, color: 'from-rose-400 to-pink-500' },
  { id: 'food-db', label: 'Food Database', icon: Database, color: 'from-emerald-400 to-teal-500' },
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

const currentTabLabel = computed(() => {
  return menuItems.find(item => item.id === activeTab.value)?.label || 'Dashboard'
})

function selectTab(id: string) {
  activeTab.value = id
  if (isMobile.value) {
    sidebarOpen.value = false
  }
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="min-h-screen flex overflow-hidden" :class="{ 'is-loaded': isLoaded }">
    <!-- Mobile Sidebar Overlay -->
    <Transition name="fade">
      <div 
        v-if="sidebarOpen && isMobile" 
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        @click="sidebarOpen = false"
      ></div>
    </Transition>

    <!-- Sidebar -->
    <aside 
      :class="[
        'sidebar relative z-50 flex flex-col transition-all duration-500 ease-out',
        isMobile 
          ? sidebarOpen ? 'fixed inset-y-0 left-0 w-80' : 'fixed inset-y-0 left-0 w-0 -translate-x-full'
          : sidebarOpen ? 'w-72' : 'w-20'
      ]"
    >
      <!-- Sidebar Background with Gradient -->
      <div class="absolute inset-0 sidebar-bg"></div>
      
      <!-- Sidebar Content -->
      <div class="relative flex flex-col h-full">
        <!-- Logo Section -->
        <div class="p-6 border-b border-white/5">
          <div class="flex items-center gap-4">
            <!-- Logo Icon -->
            <div class="logo-icon relative flex-shrink-0">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-500 flex items-center justify-center shadow-lg shadow-teal-500/25">
                <Heart class="w-6 h-6 text-white" fill="white" />
              </div>
              <!-- Pulse ring -->
              <div class="absolute inset-0 rounded-2xl border-2 border-teal-400/50 animate-ping opacity-0 logo-loaded:opacity-20"></div>
            </div>
            
            <!-- Logo Text -->
            <Transition name="slide-fade">
              <div v-if="sidebarOpen || isMobile" class="overflow-hidden">
                <h1 class="font-bold text-xl text-white tracking-tight">GlucoGuard</h1>
                <div class="flex items-center gap-1.5">
                  <Sparkles class="w-3.5 h-3.5 text-teal-400" />
                  <span class="text-xs text-stone-400 font-medium">AI Powered</span>
                </div>
              </div>
            </Transition>
            
            <!-- Mobile Close Button -->
            <button 
              v-if="isMobile && sidebarOpen" 
              @click="sidebarOpen = false"
              class="ml-auto p-2 text-stone-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors lg:hidden"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
          <button
            v-for="(item, index) in menuItems"
            :key="item.id"
            @click="selectTab(item.id)"
            :class="[
              'nav-item w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden',
              activeTab === item.id 
                ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/10 text-teal-300 border border-teal-500/30 shadow-lg shadow-teal-500/10'
                : 'text-stone-400 hover:bg-white/5 hover:text-stone-200'
            ]"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <!-- Active indicator line -->
            <div 
              v-if="activeTab === item.id"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-teal-400 to-cyan-400 rounded-full"
            ></div>
            
            <!-- Icon -->
            <div 
              :class="[
                'p-2.5 rounded-xl transition-all duration-300 flex-shrink-0',
                activeTab === item.id 
                  ? `bg-gradient-to-br ${item.color} shadow-lg` 
                  : 'bg-stone-800/50 group-hover:bg-stone-700/50'
              ]"
            >
              <component 
                :is="item.icon" 
                class="w-5 h-5 transition-transform duration-300"
                :class="activeTab === item.id ? 'text-white scale-110' : 'text-stone-400 group-hover:text-stone-300'"
              />
            </div>
            
            <!-- Label -->
            <Transition name="slide-fade">
              <span 
                v-if="sidebarOpen || isMobile" 
                class="font-semibold text-sm whitespace-nowrap"
              >
                {{ item.label }}
              </span>
            </Transition>
            
            <!-- Active dot -->
            <div 
              v-if="activeTab === item.id && (sidebarOpen || isMobile)"
              class="ml-auto w-2 h-2 rounded-full bg-teal-400 shadow-lg shadow-teal-400/50"
            ></div>
          </button>
        </nav>

        <!-- User Profile Card -->
        <div class="p-4 border-t border-white/5">
          <div 
            :class="[
              'flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 transition-all duration-300 hover:bg-white/10',
              sidebarOpen || isMobile ? '' : 'justify-center'
            ]"
          >
            <div class="relative flex-shrink-0">
              <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                <User class="w-5 h-5 text-white" />
              </div>
              <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-stone-900"></div>
            </div>
            
            <Transition name="slide-fade">
              <div v-if="sidebarOpen || isMobile" class="overflow-hidden">
                <p class="font-semibold text-sm text-white">Patient Demo</p>
                <p class="text-xs text-stone-500">Type 2 Diabetes</p>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Desktop Toggle -->
        <button
          v-if="!isMobile"
          @click="toggleSidebar"
          class="p-4 border-t border-white/5 text-stone-500 hover:text-stone-300 flex items-center justify-center transition-colors group"
        >
          <div class="p-2 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
            <ChevronLeft 
              v-if="sidebarOpen" 
              class="w-5 h-5 transition-transform duration-300" 
            />
            <ChevronRight 
              v-else 
              class="w-5 h-5 transition-transform duration-300" 
            />
          </div>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex flex-col min-w-0 relative">
      <!-- Top Navigation Bar -->
      <header class="top-bar sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div class="flex items-center gap-4">
          <!-- Mobile Menu Button -->
          <button 
            @click="sidebarOpen = true"
            class="lg:hidden p-2.5 -ml-2 text-stone-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            <Menu class="w-5 h-5" />
          </button>
          
          <!-- Page Title -->
          <div>
            <h2 class="text-xl font-bold text-white tracking-tight">{{ currentTabLabel }}</h2>
            <p class="text-sm text-stone-500 hidden sm:block">Monitor your health journey</p>
          </div>
        </div>
        
        <!-- Right Actions -->
        <div class="flex items-center gap-3">
          <!-- Notification Button -->
          <button class="relative p-2.5 text-stone-400 hover:text-white rounded-xl hover:bg-white/5 transition-all group">
            <Bell class="w-5 h-5 transition-transform group-hover:scale-110" />
            <span class="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-lg shadow-rose-500/50"></span>
          </button>
          
          <!-- Date Display -->
          <div class="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
            <span class="text-sm text-stone-400">{{ new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) }}</span>
          </div>
        </div>
      </header>

      <!-- Content Area -->
      <div class="flex-1 overflow-auto p-4 lg:p-8 content-area">
        <Transition name="page" mode="out-in">
          <component :is="currentView" :key="activeTab" />
        </Transition>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Sidebar Background */
.sidebar-bg {
  background: linear-gradient(180deg, 
    rgba(28, 25, 23, 0.98) 0%, 
    rgba(41, 37, 36, 0.95) 100%
  );
  backdrop-filter: blur(30px);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.sidebar-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at top right, rgba(20, 184, 166, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at bottom left, rgba(244, 63, 94, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

/* Top Bar */
.top-bar {
  background: rgba(28, 25, 23, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Content Area Background */
.content-area {
  background: var(--bg-gradient-premium, linear-gradient(180deg, #0c0a09 0%, #1c1917 100%));
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.page-enter-active,
.page-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Nav Item Animation */
.nav-item {
  opacity: 0;
  transform: translateX(-20px);
  animation: slideInNav 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.is-loaded .nav-item {
  animation-delay: calc(var(--index, 0) * 50ms);
}

@keyframes slideInNav {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Logo Icon Glow */
.logo-icon {
  animation: logoGlow 3s ease-in-out infinite;
}

@keyframes logoGlow {
  0%, 100% {
    filter: drop-shadow(0 0 20px rgba(20, 184, 166, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 30px rgba(20, 184, 166, 0.5));
  }
}

/* Scrollbar Styling */
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: rgba(120, 113, 108, 0.3) transparent;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(120, 113, 108, 0.3);
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgba(120, 113, 108, 0.5);
}
</style>