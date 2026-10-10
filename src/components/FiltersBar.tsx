import React from 'react';
import { Search, Filter, SlidersHorizontal, Clock, DollarSign, RotateCcw, Sparkles } from 'lucide-react';
import { FilterState, GymVibe } from '../types/gym';

interface FiltersBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableCities: string[];
  totalResults: number;
  hasActiveQuiz: boolean;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  filters,
  onFilterChange,
  availableCities,
  totalResults,
  hasActiveQuiz,
}) => {
  const vibes: { id: string; label: string }[] = [
    { id: 'all', label: 'All Vibes' },
    { id: 'hardcore_iron', label: 'Iron & Barbell' },
    { id: 'boutique_luxury', label: 'Luxury & Spa' },
    { id: 'commercial_allaround', label: 'Commercial' },
    { id: 'crossfit_functional', label: 'CrossFit' },
    { id: 'wellness_mindbody', label: 'Mind & Body' },
    { id: 'powerlifting_strength', label: 'Powerlifting' },
  ];

  const handleReset = () => {
    onFilterChange({
      searchQuery: '',
      city: 'all',
      maxPrice: 200,
      vibe: 'all',
      amenities: [],
      is24HoursOnly: false,
      sortBy: hasActiveQuiz ? 'match' : 'rating',
    });
  };

  const isFiltered = 
    filters.searchQuery !== '' || 
    filters.city !== 'all' || 
    filters.maxPrice < 200 || 
    filters.vibe !== 'all' || 
    filters.is24HoursOnly;

  return (
    <div className="bg-[#0e1424] border-y border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-3.5">
        
        {/* Top Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Field */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by gym name, amenity, or gear (e.g. Sauna, Eleiko)..."
              value={filters.searchQuery}
              onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Quick Selects: City, Price, Sort */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* City Filter */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">City:</span>
              <select
                value={filters.city}
                onChange={(e) => onFilterChange({ ...filters, city: e.target.value })}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
              >
                <option value="all">All Cities</option>
                {availableCities.map(city => (
                  <option key={city} value={city} className="bg-slate-900 text-white">
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Max Budget Filter */}
            <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Max:</span>
              <span className="text-xs font-bold text-amber-400">${filters.maxPrice}/mo</span>
              <input
                type="range"
                min="30"
                max="200"
                step="10"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-20 accent-amber-400 cursor-pointer"
              />
            </div>

            {/* 24/7 Access Toggle */}
            <button
              onClick={() => onFilterChange({ ...filters, is24HoursOnly: !filters.is24HoursOnly })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                filters.is24HoursOnly
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                  : 'bg-slate-900 text-slate-400 border-slate-700/80 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>24/7 Only</span>
            </button>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700/80">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sort:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })}
                className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
              >
                {hasActiveQuiz && <option value="match" className="bg-slate-900 text-amber-400">✨ Best Match %</option>}
                <option value="rating" className="bg-slate-900 text-white">⭐ Highest Rated</option>
                <option value="price_low" className="bg-slate-900 text-white">💵 Price: Low to High</option>
                <option value="price_high" className="bg-slate-900 text-white">💎 Price: High to Low</option>
                <option value="reviews" className="bg-slate-900 text-white">💬 Most Reviews</option>
              </select>
            </div>

            {/* Reset button if filtered */}
            {isFiltered && (
              <button
                onClick={handleReset}
                title="Reset all filters"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}

          </div>
        </div>

        {/* Vibe Filter Pills */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
          <div className="flex items-center gap-1.5">
            {vibes.map(v => (
              <button
                key={v.id}
                onClick={() => onFilterChange({ ...filters, vibe: v.id })}
                className={`px-3 py-1 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  filters.vibe === v.id
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 whitespace-nowrap hidden sm:block">
            Showing <strong className="text-white font-bold">{totalResults}</strong> gyms
          </div>
        </div>

      </div>
    </div>
  );
};
