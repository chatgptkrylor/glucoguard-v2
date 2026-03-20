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
const isPhone = ref(false)
const isLoaded = ref(false)

const handleResize = () => {
  const wasMobile = isMobile.value
  isMobile.value = window.innerWidth < 1024
  isPhone.value = window.innerWidth < 768
  if (isMobile.value !== wasMobile) {
    sidebarOpen.value = !isMobile.value
  }
}

onMounted(() => {
  isMobile.value = window.innerWidth < 1024
  isPhone.value = window.innerWidth < 768
  sidebarOpen.value = !isMobile.value
  window.addEventListener('resize', handleResize)
  setTimeout(() => { isLoaded.value = true }, 80)
  return () => window.removeEventListener('resize', handleResize)
})

const menuItems = [
  { id: 'dashboard',    label: 'Dashboard',     shortLabel: 'Home',    icon: LayoutDashboard, color: 'teal' },
  { id: 'meal-planner', label: 'Meal Planner',  shortLabel: 'Meals',   icon: Utensils,        color: 'orange' },
  { id: 'alerts',       label: 'Health Alerts', shortLabel: 'Alerts',  icon: Bell,            color: 'red' },
  { id: 'food-db',      label: 'Food Database', shortLabel: 'Foods',   icon: Database,        color: 'emerald' },
]

const activeColors: Record<string, string> = {
  teal: '#0d9488', orange: '#c2410c', red: '#b91c1c', emerald: '#15803d',
}

const currentView = computed(() => {
  switch (activeTab.value) {
    case 'dashboard':    return Dashboard
    case 'meal-planner': return MealPlanner
    case 'alerts':       return AlertsPanel
    case 'food-db':      return FoodDatabase
    default:             return Dashboard
  }
})

const currentTabLabel = computed(() =>
  menuItems.find(item => item.id === activeTab.value)?.label || 'Dashboard'
)

function selectTab(id: string) {
  activeTab.value = id
  if (isMobile.value) sidebarOpen.value = false
}

function toggleSidebar() {
  sidebarOpen.value = !sidebarOpen.value
}
</script>

<template>
  <div class="app-root" :class="{ 'is-loaded': isLoaded }">

    <!-- Mobile overlay (tablet only, not phone) -->
    <Transition name="fade">
      <div
        v-if="sidebarOpen && isMobile && !isPhone"
        class="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 lg:hidden"
        @click="sidebarOpen = false"
      />
    </Transition>

    <!-- ===== SIDEBAR (hidden on phone, visible on tablet/desktop) ===== -->
    <aside v-if="!isPhone" :class="['sidebar', isMobile
        ? sidebarOpen ? 'sidebar--mobile-open' : 'sidebar--mobile-closed'
        : sidebarOpen ? 'sidebar--desktop-open' : 'sidebar--desktop-collapsed'
    ]">
      <div class="sidebar-inner">

        <!-- Logo -->
        <div class="sidebar-logo">
          <div class="logo-icon">
            <Heart class="w-5 h-5 text-white" :fill="'white'" />
          </div>
          <Transition name="slide-fade">
            <div v-if="sidebarOpen || isMobile" class="logo-text">
              <span class="logo-name">GlucoGuard</span>
              <div class="logo-badge">
                <Sparkles class="w-3 h-3" />
                AI Powered
              </div>
            </div>
          </Transition>
          <button
            v-if="isMobile && sidebarOpen"
            @click="sidebarOpen = false"
            class="ml-auto p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Nav -->
        <nav class="sidebar-nav">
          <button
            v-for="(item, index) in menuItems"
            :key="item.id"
            @click="selectTab(item.id)"
            :class="['nav-item', activeTab === item.id ? 'nav-item--active' : 'nav-item--idle']"
            :style="{ animationDelay: `${index * 50}ms` }"
          >
            <div :class="['nav-icon', activeTab === item.id ? `nav-icon--${item.color}` : 'nav-icon--idle']">
              <component :is="item.icon" class="w-4.5 h-4.5" style="width:18px;height:18px" />
            </div>
            <Transition name="slide-fade">
              <span v-if="sidebarOpen || isMobile" class="nav-label">{{ item.label }}</span>
            </Transition>
            <div v-if="activeTab === item.id && (sidebarOpen || isMobile)" class="nav-dot" />
          </button>
        </nav>

        <!-- User card -->
        <div class="sidebar-footer">
          <div :class="['user-card', !(sidebarOpen || isMobile) && 'user-card--collapsed']">
            <div class="user-avatar">
              <User class="w-4 h-4 text-white" />
              <div class="user-status" />
            </div>
            <Transition name="slide-fade">
              <div v-if="sidebarOpen || isMobile" class="user-info">
                <p class="user-name">Patient Demo</p>
                <p class="user-type">Type 2 Diabetes</p>
              </div>
            </Transition>
          </div>

          <!-- Collapse toggle (desktop) -->
          <button
            v-if="!isMobile"
            @click="toggleSidebar"
            class="collapse-btn"
          >
            <ChevronLeft v-if="sidebarOpen" class="w-4 h-4" />
            <ChevronRight v-else class="w-4 h-4" />
          </button>
        </div>

      </div>
    </aside>

    <!-- ===== MAIN ===== -->
    <main class="main-content">

      <!-- Top bar -->
      <header class="topbar">
        <div class="topbar-left">
          <button
            v-if="!isPhone"
            @click="sidebarOpen = true"
            class="lg:hidden p-2 -ml-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <Menu class="w-5 h-5" />
          </button>
          <div>
            <h2 class="topbar-title">{{ currentTabLabel }}</h2>
            <p class="topbar-subtitle hidden sm:block">Monitor your health journey</p>
          </div>
        </div>
        <div class="topbar-right">
          <button class="topbar-btn relative">
            <Bell class="w-5 h-5" />
            <span class="notification-dot" />
          </button>
          <div class="topbar-date hidden md:flex">
            {{ new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) }}
          </div>
        </div>
      </header>

      <!-- Content -->
      <div class="content-area" :class="{ 'content-area--phone': isPhone }">
        <Transition name="page" mode="out-in">
          <component :is="currentView" :key="activeTab" />
        </Transition>
      </div>

    </main>

    <!-- ===== BOTTOM NAV (phone only) ===== -->
    <nav v-if="isPhone" class="bottom-nav" role="navigation" aria-label="Main navigation">
      <button
        v-for="item in menuItems"
        :key="item.id"
        @click="selectTab(item.id)"
        :class="['bottom-nav-item', activeTab === item.id ? 'bottom-nav-item--active' : '']"
        :style="activeTab === item.id ? { color: activeColors[item.color] } : {}"
        :aria-label="item.label"
        :aria-current="activeTab === item.id ? 'page' : undefined"
      >
        <div :class="['bnav-icon-wrap', activeTab === item.id ? `bnav-bg-${item.color}` : '']">
          <component :is="item.icon" style="width:20px;height:20px" />
        </div>
        <span class="bnav-label">{{ item.shortLabel }}</span>
      </button>
    </nav>

  </div>
</template>

<style scoped>
/* ── Layout Root ── */
.app-root {
  display: flex;
  min-height: 100vh;
  background: #fafaf9;
  overflow: hidden;
}

/* ── Sidebar ── */
.sidebar {
  position: relative;
  z-index: 50;
  flex-shrink: 0;
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.sidebar--desktop-open      { width: 260px; }
.sidebar--desktop-collapsed { width: 72px; }
.sidebar--mobile-open  { position: fixed; inset-y: 0; left: 0; width: 280px; }
.sidebar--mobile-closed { position: fixed; inset-y: 0; left: 0; width: 0; transform: translateX(-100%); }

.sidebar-inner {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e7e5e4;
  box-shadow: 2px 0 12px rgba(0,0,0,0.04);
  overflow: hidden;
}

/* ── Logo section ── */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 1.25rem 1rem;
  border-bottom: 1px solid #f5f5f4;
}

.logo-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 12px;
  background: linear-gradient(135deg, #14b8a6, #0d9488);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px -2px rgba(20,184,166,0.35);
}

.logo-text {
  overflow: hidden;
}

.logo-name {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  color: #1c1917;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.logo-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.2rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: #0d9488;
  background: #ccfbf1;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
}

/* ── Nav ── */
.sidebar-nav {
  flex: 1;
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.625rem 0.75rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
  position: relative;
}

.nav-item--idle {
  background: transparent;
  color: #78716c;
}

.nav-item--idle:hover {
  background: #f5f5f4;
  color: #1c1917;
}

.nav-item--active {
  background: #f0fdfa;
  color: #0d9488;
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(20,184,166,0.12);
}

.nav-icon {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.nav-icon--idle   { background: #f5f5f4; color: #78716c; }
.nav-item--idle:hover .nav-icon--idle { background: #e7e5e4; color: #44403c; }
.nav-icon--teal   { background: #ccfbf1; color: #0d9488; }
.nav-icon--orange { background: #ffedd5; color: #c2410c; }
.nav-icon--red    { background: #fee2e2; color: #b91c1c; }
.nav-icon--emerald { background: #dcfce7; color: #15803d; }

.nav-label {
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  flex: 1;
  text-align: left;
}

.nav-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #14b8a6;
  flex-shrink: 0;
}

/* ── Footer / User ── */
.sidebar-footer {
  padding: 0.75rem;
  border-top: 1px solid #f5f5f4;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem;
  border-radius: 12px;
  background: #f5f5f4;
  transition: all 0.2s ease;
}

.user-card--collapsed { justify-content: center; }

.user-avatar {
  position: relative;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #14b8a6, #0d9488);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-status {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #22c55e;
  border: 2px solid white;
}

.user-info { overflow: hidden; }

.user-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1c1917;
  white-space: nowrap;
}

.user-type {
  font-size: 0.7rem;
  color: #a8a29e;
  white-space: nowrap;
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.5rem;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: #a8a29e;
  cursor: pointer;
  transition: all 0.2s ease;
}

.collapse-btn:hover {
  background: #f5f5f4;
  color: #44403c;
}

/* ── Main content ── */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 100vh;
}

/* ── Top bar ── */
.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1.5rem;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid #e7e5e4;
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.topbar-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1c1917;
  letter-spacing: -0.01em;
}

.topbar-subtitle {
  font-size: 0.8rem;
  color: #a8a29e;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.topbar-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid #e7e5e4;
  background: white;
  color: #78716c;
  cursor: pointer;
  transition: all 0.2s ease;
}

.topbar-btn:hover {
  background: #f5f5f4;
  color: #1c1917;
}

.notification-dot {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef4444;
  border: 1.5px solid white;
  animation: pulse 2s ease-in-out infinite;
}

.topbar-date {
  display: flex;
  align-items: center;
  padding: 0.375rem 0.875rem;
  border-radius: 10px;
  border: 1px solid #e7e5e4;
  background: white;
  font-size: 0.8rem;
  color: #78716c;
  font-weight: 500;
}

/* ── Content area ── */
.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 1.5rem 2rem;
  background: #fafaf9;
}

@media (min-width: 1024px) {
  .content-area { padding: 2rem 2.5rem 3rem; }
}

/* ── Transitions ── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-fade-enter-from, .slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

.page-enter-active, .page-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.99);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Nav entrance animation */
.nav-item {
  opacity: 0;
  transform: translateX(-12px);
  animation: navSlide 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.is-loaded .nav-item {
  animation-play-state: running;
}

@keyframes navSlide {
  to { opacity: 1; transform: translateX(0); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* ── Bottom Navigation (phone) ── */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: rgba(255,255,255,0.97);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid #e7e5e4;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  box-shadow: 0 -2px 20px rgba(0,0,0,0.06);
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 8px 4px 10px;
  border: none;
  background: none;
  cursor: pointer;
  color: #a8a29e;
  transition: color 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  min-height: 56px;
  font-family: inherit;
}

.bnav-icon-wrap {
  width: 44px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  transition: background 0.2s ease;
}

.bnav-bg-teal    { background: #ccfbf1; }
.bnav-bg-orange  { background: #ffedd5; }
.bnav-bg-red     { background: #fee2e2; }
.bnav-bg-emerald { background: #dcfce7; }

.bnav-label {
  font-size: 0.625rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

/* ── Phone-specific content spacing ── */
.content-area--phone {
  padding: 1rem 1rem calc(68px + env(safe-area-inset-bottom, 0px)) !important;
}

/* ── Mobile topbar ── */
@media (max-width: 767px) {
  .topbar {
    padding: 0.75rem 1rem;
  }
  .topbar-btn {
    width: 44px;
    height: 44px;
  }
  .topbar-title {
    font-size: 1rem;
  }
}
</style>
