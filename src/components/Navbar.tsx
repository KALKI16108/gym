import React from 'react';
import { Dumbbell, Sparkles, Building2, Search, PlusCircle, LayoutDashboard, RotateCcw } from 'lucide-react';
import { Gym, Inquiry } from '../types/gym';

interface NavbarProps {
  onOpenQuiz: () => void;
  onOpenRegister: () => void;
  onOpenOwnerPortal: () => void;
  onResetData: () => void;
  gymCount: number;
  inquiriesCount: number;
  hasQuizResults: boolean;
  onClearQuiz: () => void;
  activeView: 'directory' | 'owner_portal';
  setActiveView: (view: 'directory' | 'owner_portal') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenQuiz,
  onOpenRegister,
  onOpenOwnerPortal,
  onResetData,
  gymCount,
  inquiriesCount,
  hasQuizResults,
  onClearQuiz,
  activeView,
  setActiveView,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0b0f17]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveView('directory')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform duration-200">
              <Dumbbell className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-['Syne']">
                  FLEX<span className="text-amber-400">FINDER</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  Directory & Owners
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Find tailored gyms & register gym websites</p>
            </div>
          </div>

          {/* Quick Search */}
          {activeView === 'directory' && (
            <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search gym, city, or equipment (e.g. Eleiko, Sauna)..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Find Match Quiz CTA */}
            <button
              onClick={onOpenQuiz}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm ${
                hasQuizResults
                  ? 'bg-amber-400/15 text-amber-300 border border-amber-400/40 hover:bg-amber-400/25'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold hover:brightness-110 shadow-orange-500/25'
              }`}
            >
              <Sparkles className="w-4 h-4 text-current" />
              <span className="hidden sm:inline">
                {hasQuizResults ? 'Retake Match Quiz' : 'Find My Gym (Quiz)'}
              </span>
              <span className="sm:hidden">Quiz</span>
            </button>

            {/* Clear quiz filter badge if active */}
            {hasQuizResults && (
              <button
                onClick={onClearQuiz}
                title="Clear quiz match filter"
                className="hidden lg:flex items-center text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800/80 border border-slate-700"
              >
                Reset Match
              </button>
            )}

            {/* Register Gym (Owner Portal CTA) */}
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-800/90 text-slate-200 border border-slate-700/80 hover:bg-slate-700 hover:border-slate-600 transition-colors"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">Register Gym Website</span>
              <span className="md:hidden">Register</span>
            </button>

            {/* Owner Portal / Leads view */}
            <button
              onClick={onOpenOwnerPortal}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors border ${
                activeView === 'owner_portal'
                  ? 'bg-amber-400/10 text-amber-300 border-amber-400/40'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
              title="Gym Owner Management Hub"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline">Owner Hub</span>
              {inquiriesCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500 text-slate-950">
                  {inquiriesCount}
                </span>
              )}
            </button>

            {/* Reset sample data */}
            <button
              onClick={() => {
                if (window.confirm('Reset gym directory back to original verified partner gyms?')) {
                  onResetData();
                }
              }}
              title="Reset Gyms to Default Demo Data"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
