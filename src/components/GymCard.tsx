import React from 'react';
import { 
  Globe, 
  MapPin, 
  Star, 
  Sparkles, 
  Clock, 
  ArrowUpRight, 
  ShieldCheck, 
  HelpCircle, 
  MessageSquarePlus,
  Dumbbell
} from 'lucide-react';
import { Gym, MatchResult } from '../types/gym';

interface GymCardProps {
  gym: Gym;
  matchResult?: MatchResult;
  onSelectGym: (gym: Gym) => void;
  onRequestTrial: (gym: Gym) => void;
}

export const GymCard: React.FC<GymCardProps> = ({
  gym,
  matchResult,
  onSelectGym,
  onRequestTrial,
}) => {
  const vibeBadges: Record<string, { label: string; color: string }> = {
    hardcore_iron: { label: 'Iron & Barbell', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
    boutique_luxury: { label: 'Luxury & Spa', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    commercial_allaround: { label: 'All-Rounder', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    crossfit_functional: { label: 'CrossFit / Box', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    wellness_mindbody: { label: 'Mind & Body', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' },
    powerlifting_strength: { label: 'Powerlifting', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  };

  const currentVibe = vibeBadges[gym.primaryVibe] || { label: 'Fitness Center', color: 'bg-slate-700 text-slate-300 border-slate-600' };

  return (
    <div className="group relative bg-[#0f1422] rounded-3xl border border-slate-800/80 hover:border-slate-700 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Media Banner */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-900 cursor-pointer" onClick={() => onSelectGym(gym)}>
        <img
          src={gym.coverImage}
          alt={gym.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1422] via-black/40 to-transparent" />

        {/* Match Score Badge (if Quiz taken) */}
        {matchResult && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/30 ring-2 ring-black/40">
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>{matchResult.score}% Match</span>
          </div>
        )}

        {/* Vibe Chip */}
        <div className={`absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md border ${currentVibe.color}`}>
          {currentVibe.label}
        </div>

        {/* 24/7 or Hours Indicator */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] font-medium text-slate-200 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>{gym.is24Hours ? 'Open 24/7' : gym.openingHours.weekdays}</span>
        </div>

        {/* Price tag */}
        <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-lg border border-amber-400/30 text-right">
          <span className="text-sm font-black text-amber-400">${gym.monthlyPrice}</span>
          <span className="text-[10px] text-slate-400">/mo</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header & Location */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 
                  onClick={() => onSelectGym(gym)}
                  className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors cursor-pointer line-clamp-1"
                >
                  {gym.name}
                </h3>
                {gym.verifiedOwner && (
                  <span title="Verified Owner Listing">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                <span className="truncate">{gym.address}, {gym.city}, {gym.state}</span>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-slate-200">{gym.rating}</span>
              <span className="text-[10px] text-slate-400">({gym.reviewCount})</span>
            </div>
          </div>

          {/* Tagline */}
          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-4">
            {gym.tagline}
          </p>

          {/* Match Reason (If available from quiz) */}
          {matchResult && matchResult.matchReasons.length > 0 && (
            <div className="mb-4 p-2.5 rounded-xl bg-amber-400/5 border border-amber-400/20 text-[11px] text-amber-300/90 flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span className="line-clamp-2 leading-snug">
                Why: {matchResult.matchReasons[0]}
              </span>
            </div>
          )}

          {/* Featured Amenities Pills */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {gym.amenities.slice(0, 3).map((amenity, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/60"
              >
                {amenity}
              </span>
            ))}
            {gym.amenities.length > 3 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-900 text-slate-500">
                +{gym.amenities.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2">
          
          {/* Primary Owner Website Link Button */}
          <a
            href={gym.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-colors group/btn"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate">Visit Official Website</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-white transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </a>

          {/* Secondary Detail & Pass Action */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelectGym(gym)}
              className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3 h-3 text-cyan-400" />
              <span>Q&A ({gym.faqs.length})</span>
            </button>

            <button
              onClick={() => onRequestTrial(gym)}
              className="py-2 px-3 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquarePlus className="w-3 h-3 text-amber-400" />
              <span>Free Pass / Tour</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
