import React from 'react';
import { Sparkles, Building2, ShieldCheck, HelpCircle, Globe, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroProps {
  onOpenQuiz: () => void;
  onOpenRegister: () => void;
  gymCount: number;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuiz, onOpenRegister, gymCount }) => {
  return (
    <div className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-[#0e1422] via-[#0b0f17] to-[#0b0f17] pt-12 pb-14">
      {/* Background glow accents */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-amber-400 font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Match Quiz & Direct Owner Registration</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight font-['Syne'] leading-[1.15] mb-6">
            Stop Guessing. <br />
            Find Your <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 bg-clip-text text-transparent">Exact Gym Match.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
            Answer a few quick questions to match with verified gyms tailored to your fitness goals, budget, and schedule. 
            Gym owners can <strong className="text-white">register their website</strong>, post facilities, and answer inquiries directly.
          </p>

          {/* Dual Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
            <button
              onClick={onOpenQuiz}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 text-slate-950 font-extrabold text-base flex items-center justify-center gap-3 shadow-xl shadow-orange-500/25 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-slate-950 fill-slate-950" />
              <span>Answer Questions & Find Gyms</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800/90 hover:bg-slate-750 text-white font-bold text-base border border-slate-700 flex items-center justify-center gap-2.5 hover:border-slate-500 transition-all cursor-pointer"
            >
              <Building2 className="w-5 h-5 text-emerald-400" />
              <span>Gym Owners: Register Website</span>
            </button>
          </div>

          {/* Trust Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80 text-left">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <Globe className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-slate-200">Official Websites</p>
                <p className="text-[11px] text-slate-400">Direct owner links</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-slate-200">Direct Owner Q&A</p>
                <p className="text-[11px] text-slate-400">Answered by staff</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <Sparkles className="w-4 h-4 text-rose-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-slate-200">Compatibility %</p>
                <p className="text-[11px] text-slate-400">Quiz match score</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-slate-200">{gymCount} Gyms Listed</p>
                <p className="text-[11px] text-slate-400">Verified facilities</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
