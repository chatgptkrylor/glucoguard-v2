import React from 'react';
import { 
  Line, 
  Bar, 
  Doughnut 
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { mockGlucoseData, mockHealthStats, mockPredictions } from '../data/mockData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard: React.FC = () => {
  const stats = mockHealthStats;

  // Glucose Trend Chart
  const glucoseChartData = {
    labels: mockGlucoseData.map(d => d.time),
    datasets: [{
      label: 'Glucose (mg/dL)',
      data: mockGlucoseData.map(d => d.value),
      borderColor: 'rgb(6, 182, 212)',
      backgroundColor: 'rgba(6, 182, 212, 0.1)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: 'rgb(6, 182, 212)',
      pointBorderColor: 'white',
      pointBorderWidth: 2,
    }]
  };

  const glucoseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: '24-Hour Glucose Trend',
        color: 'white',
        font: { size: 14, weight: 'bold' }
      }
    },
    scales: {
      y: {
        min: 50,
        max: 300,
        grid: { color: 'rgba(255,255,255,0.1)' },
        ticks: { color: 'rgba(255,255,255,0.7)' }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255,255,255,0.7)' }
      }
    }
  };

  // Time in Range Chart
  const timeInRangeData = {
    labels: ['In Range\n(70-180)', 'Below Range\n(<70)', 'Above Range\n(>180)'],
    datasets: [{
      data: [stats.timeInRange, 15, 20],
      backgroundColor: [
        'rgb(34, 197, 94)',
        'rgb(239, 68, 68)',
        'rgb(249, 115, 22)'
      ],
      borderWidth: 0,
      hoverOffset: 4
    }]
  };

  const StatCard: React.FC<{ 
    title: string; 
    value: string; 
    unit: string; 
    trend: 'up' | 'down' | 'stable';
    icon: React.ElementType;
    color: string;
  }> = ({ title, value, unit, trend, icon: Icon, color }) => (
    <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 hover:border-slate-600 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-bold ${color}`}>{value}</span>
            <span className="text-slate-500 text-sm">{unit}</span>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-').replace('400', '500/20')}`}>
          <Icon size={24} className={color} />
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2">
        {trend === 'up' && <TrendingUp size={16} className="text-red-400" />}
        {trend === 'down' && <TrendingDown size={16} className="text-green-400" />}
        {trend === 'stable' && <Activity size={16} className="text-blue-400" />}
        <span className={`text-sm ${
          trend === 'up' ? 'text-red-400' : 
          trend === 'down' ? 'text-green-400' : 
          'text-blue-400'
        }`}>
          {trend === 'up' ? '+12% vs last week' : 
           trend === 'down' ? '-8% vs last week' : 
           'Stable'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Current Glucose"
          value="142"
          unit="mg/dL"
          trend="stable"
          icon={Activity}
          color="text-cyan-400"
        />
        
        <StatCard
          title="Time in Range"
          value={stats.timeInRange.toString()}
          unit="%"
          trend="up"
          icon={CheckCircle}
          color="text-green-400"
        />
        
        <StatCard
          title="Avg Glucose (7d)"
          value={stats.averageGlucose.toString()}
          unit="mg/dL"
          trend="down"
          icon={TrendingUp}
          color="text-emerald-400"
        />
        
        <StatCard
          title="Est. HbA1c"
          value={stats.estimatedHbA1c.toFixed(1)}
          unit="%"
          trend="stable"
          icon={Info}
          color="text-purple-400"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Glucose Trend Chart */}
        <div className="lg:col-span-2 bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Glucose Trends</h3>
            <div className="flex gap-2">
              {['24h', '7d', '30d'].map((period) => (
                <button
                  key={period}
                  className="px-3 py-1 text-sm rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600"
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="h-80">
            <Line data={glucoseChartData} options={glucoseChartOptions} />
          </div>
        </div>

        {/* Time in Range */}
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-6">Time in Range</h3>
          <div className="h-64">
            <Doughnut 
              data={timeInRangeData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { color: 'white', padding: 20 }
                  }
                },
                cutout: '60%'
              }} 
            />
          </div>
          <div className="mt-4 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
            <p className="text-green-400 font-medium">Target: 70%+</p>
            <p className="text-slate-400 text-sm mt-1">You're doing great! Keep it up.</p>
          </div>
        </div>
      </div>

      {/* AI Predictions */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <AlertTriangle className="text-purple-400" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">AI Health Insights</h3>
            <p className="text-slate-400 text-sm">Predictions based on your patterns</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockPredictions.map((prediction) => (
            <div 
              key={prediction.id}
              className={`p-4 rounded-xl border ${
                prediction.probability > 70 
                  ? 'bg-red-500/10 border-red-500/30' 
                  : prediction.probability > 40
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-green-500/10 border-green-500/30'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-white capitalize">
                  {prediction.type.replace('_', ' ')}
                </span>
                <span className={`text-sm font-bold ${
                  prediction.probability > 70 ? 'text-red-400' : 
                  prediction.probability > 40 ? 'text-yellow-400' : 
                  'text-green-400'
                }`}>
                  {prediction.probability}% Risk
                </span>
              </div>
              
              <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
                <div 
                  className={`h-2 rounded-full ${
                    prediction.probability > 70 ? 'bg-red-500' : 
                    prediction.probability > 40 ? 'bg-yellow-500' : 
                    'bg-green-500'
                  }`}
                  style={{ width: `${prediction.probability}%` }}
                />
              </div>
              
              <p className="text-slate-400 text-sm">{prediction.timeframe}</p>
              
              <div className="mt-3 space-y-1">
                {prediction.recommendations.slice(0, 2).map((rec, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-slate-300">
                    <Info size={14} className="text-cyan-400 flex-shrink-0" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
