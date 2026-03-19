import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Utensils, 
  Bell, 
  TrendingUp, 
  Settings,
  User,
  Menu,
  X
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import MealPlanner from './components/MealPlanner';
import AlertsPanel from './components/AlertsPanel';
import FoodDatabase from './components/FoodDatabase';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'meal-planner', label: 'Meal Planner', icon: Utensils },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'food-db', label: 'Food Database', icon: TrendingUp },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'meal-planner':
        return <MealPlanner />;
      case 'alerts':
        return <AlertsPanel />;
      case 'food-db':
        return <FoodDatabase />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? 'w-64' : 'w-20'} 
          bg-slate-800 border-r border-slate-700 
          transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg text-white">GlucoGuard</h1>
                <p className="text-xs text-slate-400">AI Health System</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                  ${activeTab === item.id 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30' 
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                  }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-4 border-t border-slate-700 text-slate-400 hover:text-white"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between px-6">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {menuItems.find(item => item.id === activeTab)?.label}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
              <div className="text-right">
                <p className="text-sm font-medium text-white">Patient Demo</p>
                <p className="text-xs text-slate-400">Type 2 Diabetes</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
