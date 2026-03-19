import React, { useState, useMemo } from 'react';
import { Search, Filter, Leaf, Flame, Info, ChevronRight, MapPin } from 'lucide-react';
import { mockIndianFoods } from '../data/mockData';

const FoodDatabase: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedGI, setSelectedGI] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFoods = useMemo(() => {
    return mockIndianFoods.filter(food => {
      const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          food.hindiName?.includes(searchQuery);
      const matchesRegion = selectedRegion === 'all' || food.region === selectedRegion;
      const matchesGI = selectedGI === 'all' || food.glycemicLoad === selectedGI;
      const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory;
      return matchesSearch && matchesRegion && matchesGI && matchesCategory;
    });
  }, [searchQuery, selectedRegion, selectedGI, selectedCategory]);

  const getGIColor = (gi: string) => {
    switch (gi) {
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getRegionLabel = (region: string) => {
    const labels: { [key: string]: string } = {
      'north': 'North Indian',
      'south': 'South Indian',
      'east': 'East Indian',
      'west': 'West Indian',
      'pan-india': 'Pan-Indian'
    };
    return labels[region] || region;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search foods..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Region Filter */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Regions</option>
            <option value="north">North Indian</option>
            <option value="south">South Indian</option>
            <option value="east">East Indian</option>
            <option value="west">West Indian</option>
            <option value="pan-india">Pan-Indian</option>
          </select>

          {/* GI Filter */}
          <select
            value={selectedGI}
            onChange={(e) => setSelectedGI(e.target.value)}
            className="px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All GI Levels</option>
            <option value="low">Low GI (<55)</option>
            <option value="medium">Medium GI (55-70)</option>
            <option value="high">High GI (>70)</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="grain">Grains</option>
            <option value="pulse">Pulses</option>
            <option value="vegetable">Vegetables</option>
            <option value="dairy">Dairy</option>
            <option value="meat">Meat & Fish</option>
          </select>
        </div>

        <div className="mt-4 flex items-center gap-2 text-slate-400 text-sm">
          <Filter size={16} />
          <span>Showing {filteredFoods.length} of {mockIndianFoods.length} foods</span>
        </div>
      </div>

      {/* Food Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFoods.map((food) => (
          <div 
            key={food.id} 
            className="bg-slate-800 rounded-2xl p-5 border border-slate-700 hover:border-slate-600 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-white">{food.name}</h4>
                <p className="text-slate-400 text-sm">{food.hindiName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getGIColor(food.glycemicLoad)}`}>
                {food.glycemicLoad.toUpperCase()} GI
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm">
              <MapPin size={14} />
              <span>{getRegionLabel(food.region)}</span>
              <span className="mx-2">•</span>
              <span className="capitalize">{food.category}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-slate-900/50 rounded-xl">
                <p className="text-slate-400 text-xs">Serving</p>
                <p className="text-white font-medium">{food.servingSize}</p>
              </div>
              <div className="p-3 bg-slate-900/50 rounded-xl">
                <p className="text-slate-400 text-xs">GI Value</p>
                <p className="text-cyan-400 font-medium">{food.glycemicIndex}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-700">
              <div className="text-center">
                <p className="text-emerald-400 font-bold">{food.carbs}g</p>
                <p className="text-slate-500 text-xs">Carbs</p>
              </div>
              <div className="text-center">
                <p className="text-blue-400 font-bold">{food.protein}g</p>
                <p className="text-slate-500 text-xs">Protein</p>
              </div>
              <div className="text-center">
                <p className="text-orange-400 font-bold">{food.fat}g</p>
                <p className="text-slate-500 text-xs">Fat</p>
              </div>
              <div className="text-center">
                <p className="text-purple-400 font-bold">{food.calories}</p>
                <p className="text-slate-500 text-xs">Kcal</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
        <h4 className="text-white font-semibold mb-4">Glycemic Index Guide</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
            <div className="w-4 h-4 bg-green-400 rounded-full mt-1" />
            <div>
              <p className="text-green-400 font-medium">Low GI (<55)</p>
              <p className="text-slate-400 text-sm">Best for diabetes management. Slow glucose release.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
            <div className="w-4 h-4 bg-yellow-400 rounded-full mt-1" />
            <div>
              <p className="text-yellow-400 font-medium">Medium GI (55-70)</p>
              <p className="text-slate-400 text-sm">Consume in moderation. Monitor portion sizes.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-red-500/10 rounded-xl border border-red-500/20">
            <div className="w-4 h-4 bg-red-400 rounded-full mt-1" />
            <div>
              <p className="text-red-400 font-medium">High GI (>70)</p>
              <p className="text-slate-400 text-sm">Limit consumption. Quick glucose spikes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDatabase;
