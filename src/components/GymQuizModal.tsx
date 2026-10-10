import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Dumbbell, 
  Flame, 
  Heart, 
  Clock, 
  DollarSign, 
  Smile, 
  CheckCircle2, 
  Zap,
  ShieldAlert,
  FlameKindling
} from 'lucide-react';
import { QuizAnswers } from '../types/gym';

interface GymQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitAnswers: (answers: QuizAnswers) => void;
  currentAnswers?: QuizAnswers | null;
}

export const GymQuizModal: React.FC<GymQuizModalProps> = ({
  isOpen,
  onClose,
  onSubmitAnswers,
  currentAnswers,
}) => {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [answers, setAnswers] = useState<QuizAnswers>(
    currentAnswers || {
      primaryGoal: 'muscle_strength',
      budgetRange: 'moderate',
      timeSchedule: 'early_bird',
      mustHaveAmenities: ['24/7 Access', 'Sauna / Steam'],
      preferredVibe: 'hardcore_iron',
      cityLocation: '',
    }
  );

  if (!isOpen) return null;

  const goalOptions = [
    {
      id: 'muscle_strength',
      title: 'Muscle Building & Hypertrophy',
      desc: 'Specialized machines, heavy dumbbells, barbell zones, and contest prep.',
      icon: Dumbbell,
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: 'powerlifting',
      title: 'Powerlifting & Heavy Barbell',
      desc: 'Olympic platforms, chalk allowed, calibrated steel plates, combo racks.',
      icon: Zap,
      color: 'from-orange-500 to-red-600',
    },
    {
      id: 'fat_loss',
      title: 'Fat Loss & Cardio Conditioning',
      desc: 'Stairmasters, treadmills, turf tracks, circuit lines, and heart rate tracking.',
      icon: Flame,
      color: 'from-rose-500 to-pink-600',
    },
    {
      id: 'crossfit',
      title: 'Functional Fitness & CrossFit',
      desc: 'Coached daily WODs, rigs, gymnastics rings, assault bikes, and group sweat.',
      icon: FlameKindling,
      color: 'from-yellow-500 to-amber-600',
    },
    {
      id: 'wellness',
      title: 'Mind-Body, Pilates & Recovery',
      desc: 'Reformer studios, hot yoga, cedar sauna, cold plunges, and low-impact toning.',
      icon: Heart,
      color: 'from-teal-400 to-emerald-600',
    },
    {
      id: 'general_fitness',
      title: 'General Health & Routine Maintenance',
      desc: 'Clean versatile facility, beginner friendly, all-around resistance & cardio.',
      icon: Smile,
      color: 'from-blue-500 to-indigo-600',
    },
  ];

  const budgetOptions = [
    {
      id: 'budget',
      title: 'High-Value Budget (< $40 / month)',
      desc: 'Essential machines, clean locker rooms, 24/7 access, no unnecessary luxury surcharge.',
      price: '$10 - $35/mo',
    },
    {
      id: 'moderate',
      title: 'Mid-Tier Performance ($40 - $80 / month)',
      desc: 'Dedicated platforms, quality barbells, better equipment maintenance, fewer crowds.',
      price: '$45 - $75/mo',
    },
    {
      id: 'premium',
      title: 'Dedicated Specialty Club ($80 - $130 / month)',
      desc: 'Top-tier equipment (Eleiko, Rogue, Prime), community focus, sauna, towel service.',
      price: '$85 - $125/mo',
    },
    {
      id: 'luxury',
      title: 'Luxury Athletic Sanctuary ($130+ / month)',
      desc: 'Cold plunge, executive coworking lounge, organic smoothie bar, spa amenities.',
      price: '$140+/mo',
    },
  ];

  const scheduleOptions = [
    {
      id: 'early_bird',
      title: 'Dawn Patrol (5:00 AM – 8:00 AM)',
      desc: 'Beat the morning crowd before work starts. Fast check-in required.',
    },
    {
      id: 'midday',
      title: 'Lunchtime & Afternoon (11:00 AM – 3:00 PM)',
      desc: 'Flexible hours, midday energy boost during lighter gym traffic.',
    },
    {
      id: 'evening_peak',
      title: 'After-Work Rush (5:00 PM – 9:00 PM)',
      desc: 'Peak hours; sufficient squat racks and benches are paramount.',
    },
    {
      id: 'night_24_7',
      title: 'Night Owl / Non-Traditional (Must Have 24/7 Access)',
      desc: 'Late nights, shift worker schedules, or weekend midnight lifting.',
    },
  ];

  const amenityChoices = [
    '24/7 Access',
    'Olympic Weightlifting Platforms',
    'Chalk Permitted',
    'Heavy Dumbbells (125lb+)',
    'Sauna & Steam Room',
    'Cold Plunge / Recovery Pools',
    'Reformer Pilates / Yoga',
    'Free On-Site Parking',
    'Personal Trainers On Staff',
    'Locker Rooms with Showers',
    'Smoothie & Protein Bar',
    'Coached Group Classes',
  ];

  const vibeOptions = [
    {
      id: 'hardcore_iron',
      title: 'Old-School Iron & Powerhouse',
      desc: 'Loud music, chalk dust, heavy weights clanging, intense work ethic.',
      badge: 'Chalk & Iron',
    },
    {
      id: 'boutique_luxury',
      title: 'Boutique Luxury & Wellness',
      desc: 'Immaculately clean, soothing lighting, plush towels, cold plunges, quiet focus.',
      badge: 'Spa & Performance',
    },
    {
      id: 'crossfit_functional',
      title: 'Energetic Community & Team Spirit',
      desc: 'Supportive peers cheering you on, coach accountability, high-fives.',
      badge: 'Group Grit',
    },
    {
      id: 'commercial_allaround',
      title: 'Convenient & Modern All-Rounder',
      desc: 'No-intimidation, spacious layout, plenty of machines, plug in headphones and train.',
      badge: 'Balanced & Easy',
    },
    {
      id: 'wellness_mindbody',
      title: 'Peaceful Mindful Movement',
      desc: 'Holistic wellness, alignment focus, yoga vibes, breathwork.',
      badge: 'Mind & Body',
    },
  ];

  const toggleAmenity = (item: string) => {
    setAnswers(prev => {
      const exists = prev.mustHaveAmenities.includes(item);
      if (exists) {
        return { ...prev, mustHaveAmenities: prev.mustHaveAmenities.filter(a => a !== item) };
      } else {
        return { ...prev, mustHaveAmenities: [...prev.mustHaveAmenities, item] };
      }
    });
  };

  const handleFinish = () => {
    onSubmitAnswers(answers);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0f1523] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-['Syne']">
                Find Your Match: Quick Questionnaire
              </h2>
              <p className="text-xs text-slate-400">
                Question {step} of {totalSteps} • Answers calculate your compatibility score
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5">
          <div
            className="bg-gradient-to-r from-amber-400 to-orange-500 h-1.5 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
          
          {/* STEP 1: Primary Fitness Goal */}
          {step === 1 && (
            <div>
              <div className="mb-6">
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">Question 1</span>
                <h3 className="text-xl font-extrabold text-white mt-1">What is your primary fitness goal?</h3>
                <p className="text-sm text-slate-400 mt-1">
                  We will prioritize gyms equipped with the exact gear and environment for this objective.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {goalOptions.map(opt => {
                  const Icon = opt.icon;
                  const isSelected = answers.primaryGoal === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAnswers(prev => ({ ...prev, primaryGoal: opt.id }))}
                      className={`text-left p-4 rounded-2xl border transition-all duration-200 relative cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-400/10 border-amber-400 shadow-md shadow-amber-500/10'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${opt.color} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-slate-950" />
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white">{opt.title}</h4>
                        <p className="text-xs text-slate-400 mt-1 leading-snug">{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Monthly Budget Range */}
          {step === 2 && (
            <div>
              <div className="mb-6">
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">Question 2</span>
                <h3 className="text-xl font-extrabold text-white mt-1">What is your ideal monthly budget?</h3>
                <p className="text-sm text-slate-400 mt-1">
                  We will match gyms with rates and plans that fit comfortably within your expectations.
                </p>
              </div>

              <div className="space-y-3">
                {budgetOptions.map(opt => {
                  const isSelected = answers.budgetRange === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAnswers(prev => ({ ...prev, budgetRange: opt.id }))}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400/10 border-amber-400 shadow-md shadow-amber-500/10'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 text-sm">
                          <DollarSign className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-white">{opt.title}</h4>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300">
                              {opt.price}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{opt.desc}</p>
                        </div>
                      </div>

                      <div className="ml-4 shrink-0">
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-slate-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Schedule & Hours */}
          {step === 3 && (
            <div>
              <div className="mb-6">
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">Question 3</span>
                <h3 className="text-xl font-extrabold text-white mt-1">When do you usually train?</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Helps identify gyms with 24/7 keycard entry or extended dawn/night hours.
                </p>
              </div>

              <div className="space-y-3">
                {scheduleOptions.map(opt => {
                  const isSelected = answers.timeSchedule === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAnswers(prev => ({ ...prev, timeSchedule: opt.id }))}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400/10 border-amber-400 shadow-md shadow-amber-500/10'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                          <Clock className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white">{opt.title}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                        </div>
                      </div>

                      <div className="ml-4 shrink-0">
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-slate-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Must-have Amenities */}
          {step === 4 && (
            <div>
              <div className="mb-6">
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">Question 4</span>
                <h3 className="text-xl font-extrabold text-white mt-1">Select your must-have amenities</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Choose any features that you cannot train without (multi-select).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {amenityChoices.map(amenity => {
                  const isChecked = answers.mustHaveAmenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-amber-400/15 border-amber-400 text-white font-semibold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/40 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs sm:text-sm">{amenity}</span>
                      <div className="shrink-0 ml-2">
                        {isChecked ? (
                          <div className="w-4 h-4 rounded bg-amber-400 flex items-center justify-center">
                            <Check className="w-3 h-3 text-slate-950 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded border border-slate-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500 mt-3">
                Selected: {answers.mustHaveAmenities.length} amenities
              </p>
            </div>
          )}

          {/* STEP 5: Atmosphere & Preferred Vibe */}
          {step === 5 && (
            <div>
              <div className="mb-6">
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">Question 5</span>
                <h3 className="text-xl font-extrabold text-white mt-1">What gym atmosphere inspires you?</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Every gym has a distinctive energy. Choose what fits your mindset best.
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {vibeOptions.map(opt => {
                  const isSelected = answers.preferredVibe === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setAnswers(prev => ({ ...prev, preferredVibe: opt.id }))}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400/10 border-amber-400 shadow-md shadow-amber-500/10'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{opt.title}</h4>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{opt.desc}</p>
                      </div>

                      <div className="ml-4 shrink-0">
                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border border-slate-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Optional City Filter */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Filter by City / Metro Area (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Austin, Downtown, or leave empty for all"
                  value={answers.cityLocation || ''}
                  onChange={(e) => setAnswers(prev => ({ ...prev, cityLocation: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-slate-800/80 bg-slate-900/70 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={() => setStep(s => s + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition-all cursor-pointer shadow-md"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-extrabold bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-orange-500/20"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Calculate My Gym Matches</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
