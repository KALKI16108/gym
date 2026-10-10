import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Building2, 
  Globe, 
  CheckCircle2, 
  Dumbbell, 
  Search, 
  RotateCcw, 
  ShieldCheck, 
  HelpCircle,
  PlusCircle,
  SlidersHorizontal,
  ArrowRight,
  Flame,
  Award
} from 'lucide-react';
import { Gym, QuizAnswers, FilterState, MatchResult } from './types/gym';
import { 
  getStoredGyms, 
  subscribeToGyms, 
  calculateGymMatch, 
  resetToDefaultGyms, 
  getAllInquiries 
} from './services/gymStorage';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FiltersBar } from './components/FiltersBar';
import { GymCard } from './components/GymCard';
import { GymQuizModal } from './components/GymQuizModal';
import { GymRegistrationModal } from './components/GymRegistrationModal';
import { GymDetailModal } from './components/GymDetailModal';
import { OwnerDashboardModal } from './components/OwnerDashboardModal';
import { OwnerPortalView } from './components/OwnerPortalView';

export default function App() {
  const [gyms, setGyms] = useState<Gym[]>(() => getStoredGyms());
  const [activeView, setActiveView] = useState<'directory' | 'owner_portal'>('directory');

  // Modals state
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  
  // Selected gym detail state
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [detailDefaultTab, setDetailDefaultTab] = useState<'overview' | 'qa' | 'inquiry' | 'reviews'>('overview');

  // Questionnaire / Match state
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(() => {
    try {
      const saved = localStorage.getItem('flexfinder_quiz_answers');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Success Notification Banner
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    city: 'all',
    maxPrice: 200,
    vibe: 'all',
    amenities: [],
    is24HoursOnly: false,
    sortBy: quizAnswers ? 'match' : 'rating',
  });

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = subscribeToGyms(() => {
      const updated = getStoredGyms();
      setGyms(updated);
      if (selectedGym) {
        const freshSelected = updated.find(g => g.id === selectedGym.id);
        if (freshSelected) setSelectedGym(freshSelected);
      }
    });
    return unsubscribe;
  }, [selectedGym]);

  // Handle Quiz Submission
  const handleQuizSubmit = (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    localStorage.setItem('flexfinder_quiz_answers', JSON.stringify(answers));
    setFilters(prev => ({
      ...prev,
      sortBy: 'match',
      city: answers.cityLocation && answers.cityLocation.trim() !== '' ? 'all' : prev.city,
    }));
    showNotification('Questionnaire complete! Your gym matches have been calculated.', 'success');
  };

  const handleClearQuiz = () => {
    setQuizAnswers(null);
    localStorage.removeItem('flexfinder_quiz_answers');
    setFilters(prev => ({ ...prev, sortBy: 'rating' }));
    showNotification('Quiz match filters reset.', 'info');
  };

  // Handle New Gym Registration
  const handleGymRegistered = (newGym: Gym) => {
    setGyms(getStoredGyms());
    setSelectedGym(newGym);
    setDetailDefaultTab('overview');
    showNotification(`Congratulations! "${newGym.name}" and your official website are now registered and live!`, 'success');
  };

  // Extract available cities
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    gyms.forEach(g => {
      if (g.city) cities.add(g.city);
    });
    return Array.from(cities).sort();
  }, [gyms]);

  // Compute Match Scores
  const gymMatchMap = useMemo(() => {
    const map = new Map<string, MatchResult>();
    if (!quizAnswers) return map;

    gyms.forEach(g => {
      const match = calculateGymMatch(g, quizAnswers);
      map.set(g.id, match);
    });
    return map;
  }, [gyms, quizAnswers]);

  // Filter & Sort Gyms
  const filteredGyms = useMemo(() => {
    return gyms.filter(gym => {
      // Search Query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesName = gym.name.toLowerCase().includes(query);
        const matchesCity = gym.city.toLowerCase().includes(query);
        const matchesAmenity = gym.amenities.some(a => a.toLowerCase().includes(query));
        const matchesGear = gym.equipmentBrands.some(b => b.toLowerCase().includes(query));
        const matchesTagline = gym.tagline.toLowerCase().includes(query);
        if (!matchesName && !matchesCity && !matchesAmenity && !matchesGear && !matchesTagline) {
          return false;
        }
      }

      // City filter
      if (filters.city !== 'all') {
        if (gym.city.toLowerCase() !== filters.city.toLowerCase()) {
          return false;
        }
      }

      // Max Price
      if (gym.monthlyPrice > filters.maxPrice) {
        return false;
      }

      // 24/7 filter
      if (filters.is24HoursOnly && !gym.is24Hours) {
        return false;
      }

      // Vibe filter
      if (filters.vibe !== 'all' && gym.primaryVibe !== filters.vibe) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'match' && quizAnswers) {
        const scoreA = gymMatchMap.get(a.id)?.score || 0;
        const scoreB = gymMatchMap.get(b.id)?.score || 0;
        return scoreB - scoreA;
      }
      if (filters.sortBy === 'price_low') {
        return a.monthlyPrice - b.monthlyPrice;
      }
      if (filters.sortBy === 'price_high') {
        return b.monthlyPrice - a.monthlyPrice;
      }
      if (filters.sortBy === 'reviews') {
        return b.reviewCount - a.reviewCount;
      }
      // default: rating
      return b.rating - a.rating;
    });
  }, [gyms, filters, quizAnswers, gymMatchMap]);

  // Count inquiries
  const totalInquiries = getAllInquiries().length;

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950">
      
      {/* Top Notification Toast */}
      {notification && (
        <div className="fixed top-24 right-4 z-50 max-w-md p-4 rounded-2xl bg-slate-900 border border-amber-400/50 text-white shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs font-medium leading-snug">{notification.message}</span>
          </div>
          <button 
            onClick={() => setNotification(null)}
            className="text-xs text-slate-400 hover:text-white shrink-0 ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenOwnerPortal={() => setActiveView('owner_portal')}
        onResetData={() => {
          resetToDefaultGyms();
          setGyms(getStoredGyms());
          setQuizAnswers(null);
          showNotification('Gym directory restored to verified partner gyms.', 'info');
        }}
        gymCount={gyms.length}
        inquiriesCount={totalInquiries}
        hasQuizResults={Boolean(quizAnswers)}
        onClearQuiz={handleClearQuiz}
        activeView={activeView}
        setActiveView={setActiveView}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters(prev => ({ ...prev, searchQuery: q }))}
      />

      {/* Main Content Area */}
      {activeView === 'owner_portal' ? (
        <OwnerPortalView
          gyms={gyms}
          onOpenRegister={() => setIsRegisterOpen(true)}
          onSelectGym={(gym) => {
            setSelectedGym(gym);
            setDetailDefaultTab('overview');
          }}
          onRefreshGyms={() => setGyms(getStoredGyms())}
          onBackToDirectory={() => setActiveView('directory')}
        />
      ) : (
        <main className="flex-1">
          {/* Hero Banner */}
          <Hero
            onOpenQuiz={() => setIsQuizOpen(true)}
            onOpenRegister={() => setIsRegisterOpen(true)}
            gymCount={gyms.length}
          />

          {/* Quiz Match Active Banner */}
          {quizAnswers && (
            <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-rose-500/15 border-b border-amber-400/30 py-3.5 px-4 sm:px-6">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Personalized Match Active:</strong> Gyms are ranked by compatibility with your answered preferences ({quizAnswers.primaryGoal.replace('_', ' ')}, {quizAnswers.budgetRange} budget).
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsQuizOpen(true)}
                    className="font-bold text-amber-400 hover:underline"
                  >
                    Adjust Answers
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    onClick={handleClearQuiz}
                    className="text-slate-400 hover:text-white"
                  >
                    Clear Match
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sticky Filters Bar */}
          <div className="sticky top-20 z-30 shadow-md">
            <FiltersBar
              filters={filters}
              onFilterChange={setFilters}
              availableCities={availableCities}
              totalResults={filteredGyms.length}
              hasActiveQuiz={Boolean(quizAnswers)}
            />
          </div>

          {/* Gym Listings Grid */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {filteredGyms.length === 0 ? (
              <div className="p-12 sm:p-16 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4 max-w-xl mx-auto my-8">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                  <Dumbbell className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white font-['Syne']">
                  No Gyms Match Your Current Filters
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Try broadening your price range, clearing the search query, or checking all vibes.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => setFilters({
                      searchQuery: '',
                      city: 'all',
                      maxPrice: 200,
                      vibe: 'all',
                      amenities: [],
                      is24HoursOnly: false,
                      sortBy: 'rating',
                    })}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
                  >
                    Reset All Filters
                  </button>
                  <button
                    onClick={() => setIsRegisterOpen(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-xs font-bold transition-all hover:brightness-110"
                  >
                    Register Your Gym Here
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredGyms.map(gym => (
                  <GymCard
                    key={gym.id}
                    gym={gym}
                    matchResult={gymMatchMap.get(gym.id)}
                    onSelectGym={(g) => {
                      setSelectedGym(g);
                      setDetailDefaultTab('overview');
                    }}
                    onRequestTrial={(g) => {
                      setSelectedGym(g);
                      setDetailDefaultTab('inquiry');
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="bg-[#080c14] border-t border-slate-800/80 pt-12 pb-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                </div>
                <span className="text-lg font-black text-white font-['Syne']">
                  FLEX<span className="text-amber-400">FINDER</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                The premier gym discovery engine connecting fitness seekers with verified gym websites, personalized questionnaire matches, and direct owner Q&A.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">For Fitness Seekers</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setIsQuizOpen(true)} className="hover:text-amber-400 transition-colors">
                    Take 60-Sec Match Quiz
                  </button>
                </li>
                <li>
                  <button onClick={() => setFilters(f => ({ ...f, is24HoursOnly: true }))} className="hover:text-amber-400 transition-colors">
                    Find 24/7 Access Gyms
                  </button>
                </li>
                <li>
                  <button onClick={() => setFilters(f => ({ ...f, vibe: 'hardcore_iron' }))} className="hover:text-amber-400 transition-colors">
                    Powerlifting & Iron Gyms
                  </button>
                </li>
                <li>
                  <button onClick={() => setFilters(f => ({ ...f, vibe: 'boutique_luxury' }))} className="hover:text-amber-400 transition-colors">
                    Luxury & Wellness Clubs
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">For Gym Owners</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => setIsRegisterOpen(true)} className="text-emerald-400 font-semibold hover:underline">
                    Register Your Gym Website
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveView('owner_portal')} className="hover:text-amber-400 transition-colors">
                    Owner Dashboard & Leads
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => {
                      if (window.confirm('Reset directory back to default partner gyms?')) {
                        resetToDefaultGyms();
                        setGyms(getStoredGyms());
                      }
                    }} 
                    className="hover:text-amber-400 transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Demo Data</span>
                  </button>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} FlexFinder Platform. All gym websites and listings are maintained by respective verified owners.</p>
            <div className="flex items-center gap-4">
              <span>Direct Link Forwarding</span>
              <span>•</span>
              <span>Zero Middleman Surcharges</span>
              <span>•</span>
              <span>Real Q&A Answers</span>
            </div>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      
      {/* 1. Guided Match Quiz */}
      <GymQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onSubmitAnswers={handleQuizSubmit}
        currentAnswers={quizAnswers}
      />

      {/* 2. Gym Owner Registration Form */}
      <GymRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onGymRegistered={handleGymRegistered}
      />

      {/* 3. Detailed Gym Profile, Q&A & Day Pass Modal */}
      <GymDetailModal
        gym={selectedGym}
        isOpen={Boolean(selectedGym)}
        onClose={() => setSelectedGym(null)}
        defaultTab={detailDefaultTab}
        onGymUpdated={() => setGyms(getStoredGyms())}
      />

      {/* 4. Owner Management Modal */}
      <OwnerDashboardModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
        gyms={gyms}
        onOpenRegister={() => {
          setIsOwnerModalOpen(false);
          setIsRegisterOpen(true);
        }}
        onViewGym={(gym) => {
          setIsOwnerModalOpen(false);
          setSelectedGym(gym);
          setDetailDefaultTab('overview');
        }}
        onRefreshGyms={() => setGyms(getStoredGyms())}
      />

    </div>
  );
}
