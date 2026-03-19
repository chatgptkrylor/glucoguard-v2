import React from 'react';
import { Bell, AlertTriangle, CheckCircle, Clock, AlertCircle, ChevronRight } from 'lucide-react';
import { mockAlerts } from '../data/mockData';

const AlertsPanel: React.FC = () => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-400';
      case 'high': return 'bg-orange-500/20 border-orange-500/50 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      default: return 'bg-blue-500/20 border-blue-500/50 text-blue-400';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'hypoglycemia': return <AlertTriangle className="text-red-400" size={24} />;
      case 'hyperglycemia': return <AlertTriangle className="text-orange-400" size={24} />;
      case 'pattern': return <AlertCircle className="text-yellow-400" size={24} />;
      case 'medication': return <Bell className="text-blue-400" size={24} />;
      default: return <CheckCircle className="text-green-400" size={24} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Alerts', value: '3', icon: Bell, color: 'text-red-400' },
          { label: 'High Priority', value: '1', icon: AlertTriangle, color: 'text-orange-400' },
          { label: 'Resolved Today', value: '5', icon: CheckCircle, color: 'text-green-400' },
          { label: 'Avg Response', value: '2m', icon: Clock, color: 'text-cyan-400' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-800 rounded-2xl p-5 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon size={28} className={stat.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Active Alerts */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Active Alerts</h3>
          <button className="text-sm text-cyan-400 hover:text-cyan-300">
            Mark All as Read
          </button>
        </div>

        <div className="space-y-4">
          {mockAlerts.map((alert) => (
            <div 
              key={alert.id}
              className={`p-4 rounded-xl border ${getSeverityColor(alert.severity)} ${
                alert.acknowledged ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-slate-900/50 rounded-lg flex-shrink-0">
                  {getAlertIcon(alert.type)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{alert.title}</h4>
                    <span className="text-xs text-slate-400">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <p className="text-slate-300 mb-3">{alert.message}</p>
                  
                  {alert.action && (
                    <div className="flex items-center gap-2 p-3 bg-slate-900/50 rounded-lg">
                      <ChevronRight size={16} className="text-cyan-400" />
                      <span className="text-cyan-400 text-sm font-medium">{alert.action}</span>
                    </div>
                  )}
                </div>

                {!alert.acknowledged && (
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors">
                    Acknowledge
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Settings */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-6">Alert Thresholds</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Low Glucose Alert</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="50"
                max="100"
                defaultValue="70"
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-cyan-400 font-medium w-16">70 mg/dL</span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">High Glucose Alert</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="150"
                max="300"
                defaultValue="180"
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-orange-400 font-medium w-16">180 mg/dL</span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Pattern Detection Sensitivity</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="10"
                defaultValue="7"
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-purple-400 font-medium w-16">High</span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Quiet Hours</label>
            <div className="flex items-center gap-2">
              <input
                type="time"
                defaultValue="22:00"
                className="px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
              />
              <span className="text-slate-400">to</span>
              <input
                type="time"
                defaultValue="07:00"
                className="px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Email Notifications</p>
              <p className="text-slate-400 text-sm">Receive critical alerts via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;
