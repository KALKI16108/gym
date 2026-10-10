import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Star, 
  ShieldCheck, 
  HelpCircle, 
  MessageSquare, 
  Dumbbell, 
  Check, 
  Send, 
  Calendar, 
  ExternalLink,
  Sparkles,
  Info,
  UserCheck
} from 'lucide-react';
import { Gym, FAQ, Review, Inquiry } from '../types/gym';
import { addFAQ, addReview, submitInquiry } from '../services/gymStorage';

interface GymDetailModalProps {
  gym: Gym | null;
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'overview' | 'qa' | 'inquiry' | 'reviews';
  onGymUpdated: () => void;
}

export const GymDetailModal: React.FC<GymDetailModalProps> = ({
  gym,
  isOpen,
  onClose,
  defaultTab = 'overview',
  onGymUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'qa' | 'inquiry' | 'reviews'>(defaultTab);

  // Ask Question Form State
  const [newQuestion, setNewQuestion] = useState('');
  const [askerName, setAskerName] = useState('');
  const [qaSuccess, setQaSuccess] = useState(false);

  // Inquiry Form State
  const [seekerName, setSeekerName] = useState('');
  const [seekerEmail, setSeekerEmail] = useState('');
  const [seekerPhone, setSeekerPhone] = useState('');
  const [interestType, setInterestType] = useState<Inquiry['interestType']>('day_pass');
  const [preferredDate, setPreferredDate] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Review Form State
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!isOpen || !gym) return null;

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    addFAQ(
      gym.id,
      newQuestion.trim(),
      'Question received! The gym owner has been notified and their direct response will appear here.',
      askerName.trim() || 'Fitness Seeker',
      false
    );

    setNewQuestion('');
    setAskerName('');
    setQaSuccess(true);
    setTimeout(() => setQaSuccess(false), 5000);
    onGymUpdated();
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seekerName.trim() || !seekerEmail.trim()) return;

    submitInquiry({
      gymId: gym.id,
      gymName: gym.name,
      seekerName: seekerName.trim(),
      seekerEmail: seekerEmail.trim(),
      seekerPhone: seekerPhone.trim(),
      interestType,
      preferredDate,
      message: inquiryMessage.trim() || `Interested in a ${interestType.replace('_', ' ')} at ${gym.name}.`,
    });

    setInquirySubmitted(true);
    onGymUpdated();
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    addReview(
      gym.id,
      reviewAuthor.trim() || 'Verified Gym-Goer',
      reviewRating,
      reviewComment.trim()
    );

    setReviewAuthor('');
    setReviewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 5000);
    onGymUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0d121f] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-4">
        
        {/* Cover Hero Banner */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-900 overflow-hidden">
          <img
            src={gym.coverImage}
            alt={gym.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d121f] via-[#0d121f]/50 to-black/30" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Gym Title & Website CTA overlay */}
          <div className="absolute bottom-6 inset-x-6 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  {gym.city}, {gym.state}
                </span>
                {gym.verifiedOwner && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified Gym Owner
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-['Syne'] tracking-tight">
                {gym.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 line-clamp-2">
                {gym.tagline}
              </p>
            </div>

            {/* Official Website CTA */}
            <div className="shrink-0 flex items-center gap-2">
              <a
                href={gym.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-sm flex items-center gap-2 shadow-xl shadow-orange-500/25 hover:brightness-110 transition-all"
              >
                <Globe className="w-4 h-4 text-slate-950" />
                <span>Visit Official Website</span>
                <ExternalLink className="w-4 h-4 text-slate-950" />
              </a>
            </div>
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-slate-900/90 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">{gym.address}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="truncate">{gym.is24Hours ? 'Open 24/7 Access' : gym.openingHours.weekdays}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{gym.phone}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-300">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
            <span className="font-bold">{gym.rating} / 5.0</span>
            <span className="text-slate-500">({gym.reviewCount} reviews)</span>
          </div>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Overview & Facilities</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('qa')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 relative ${
              activeTab === 'qa'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Owner Q&A ({gym.faqs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inquiry')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'inquiry'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Free Day Pass / Tour</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reviews')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Reviews ({gym.reviews.length})</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[55vh] overflow-y-auto">
          
          {/* TAB 1: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* About description */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  About This Facility
                </h3>
                <p className="text-sm text-slate-200 leading-relaxed">
                  {gym.description}
                </p>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Monthly Membership</span>
                    <h4 className="text-2xl font-black text-amber-400">${gym.monthlyPrice} <span className="text-xs text-slate-400 font-normal">/ month</span></h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Full facility access, no long-term lock-in.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('inquiry')}
                    className="px-3.5 py-2 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/30 text-xs font-bold hover:bg-amber-400/20"
                  >
                    Inquire
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Single Day Pass / Drop-in</span>
                    <h4 className="text-2xl font-black text-white">${gym.dayPassPrice || 20} <span className="text-xs text-slate-400 font-normal">/ day</span></h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">Try out the equipment before committing.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('inquiry')}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold hover:bg-slate-700"
                  >
                    Claim Pass
                  </button>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Amenities & Facilities ({gym.amenities.length})
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {gym.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-2.5 text-xs text-slate-200"
                    >
                      <div className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span className="font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Equipment Brands */}
              {gym.equipmentBrands.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Dumbbell className="w-3.5 h-3.5 text-amber-400" />
                    Equipment Manufacturers on Floor
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {gym.equipmentBrands.map((brand, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Hours Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Operating Hours
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">Monday – Friday</span>
                    <span className="font-semibold text-white">{gym.openingHours.weekdays}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Saturday</span>
                    <span className="font-semibold text-white">{gym.openingHours.saturday}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Sunday</span>
                    <span className="font-semibold text-white">{gym.openingHours.sunday}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Owner Q&A */}
          {activeTab === 'qa' && (
            <div className="space-y-6">
              
              {/* Header note */}
              <div className="p-4 rounded-2xl bg-amber-400/5 border border-amber-400/20 flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white font-semibold">Direct Answers from the Gym Owner:</strong> Have a specific question about day passes, barbell weights, or policies? Check verified owner responses below or submit your own question.
                </div>
              </div>

              {/* FAQs List */}
              <div className="space-y-4">
                {gym.faqs.map(faq => (
                  <div key={faq.id} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="text-amber-400 font-black">Q:</span>
                        {faq.question}
                      </h4>
                      <span className="text-[10px] text-slate-500 shrink-0">{faq.dateAdded}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="text-xs text-slate-300">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="font-bold text-emerald-400">
                            {faq.answeredByOwner ? 'Owner Answer' : 'Staff / Member Answer'}
                          </span>
                          <span className="text-[10px] text-slate-500">• Verified</span>
                        </div>
                        <p className="leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ask Question Form */}
              <form onSubmit={handleAskQuestion} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  Ask the Gym Owner a Question
                </h4>
                
                {qaSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                    Your question has been sent directly to the gym owner!
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your Name (e.g. Alex)"
                    value={askerName}
                    onChange={(e) => setAskerName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    required
                    placeholder="What would you like to know? (e.g. Do you have chalk buckets?)"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  Post Question
                </button>
              </form>

            </div>
          )}

          {/* TAB 3: Claim Free Day Pass / Book Tour */}
          {activeTab === 'inquiry' && (
            <div>
              {inquirySubmitted ? (
                <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h3 className="text-xl font-bold text-white font-['Syne']">
                    Request Received by {gym.name}!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                    The gym owner has been notified of your request. They will confirm your day pass or tour via email ({seekerEmail}).
                  </p>
                  <div className="pt-2">
                    <a
                      href={gym.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700"
                    >
                      <Globe className="w-3.5 h-3.5 text-amber-400" />
                      <span>Also visit their official website</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendInquiry} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-amber-400/5 border border-amber-400/20">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                      Direct Connection to Gym Management
                    </h4>
                    <p className="text-xs text-slate-300 leading-snug">
                      Schedule a facility walkthrough or claim a trial session with zero middleman markups.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={seekerName}
                        onChange={(e) => setSeekerName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={seekerEmail}
                        onChange={(e) => setSeekerEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Phone (Optional)</label>
                      <input
                        type="text"
                        placeholder="(555) 000-0000"
                        value={seekerPhone}
                        onChange={(e) => setSeekerPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">What are you looking for?</label>
                      <select
                        value={interestType}
                        onChange={(e) => setInterestType(e.target.value as Inquiry['interestType'])}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="day_pass">Free Day Pass / Trial</option>
                        <option value="tour">Facility Tour & Walkthrough</option>
                        <option value="membership">Membership Rates & Signup</option>
                        <option value="general">Personal Training Consultation</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1">Preferred Date</label>
                      <input
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Personal Goals / Message</label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Looking to train powerlifting, wondering if you have calibrated plates available..."
                      value={inquiryMessage}
                      onChange={(e) => setInquiryMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600 text-slate-950 font-extrabold text-sm shadow-lg shadow-orange-500/20 hover:brightness-110 transition-all cursor-pointer"
                  >
                    Submit Request to Gym Owner
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              
              {/* Existing Reviews */}
              <div className="space-y-3">
                {gym.reviews.map(rev => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{rev.authorName}</span>
                        <div className="flex text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500">{rev.date}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}

                {gym.reviews.length === 0 && (
                  <p className="text-xs text-slate-500 text-center py-4">No reviews yet. Be the first to share your experience!</p>
                )}
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleAddReview} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Write a Review for {gym.name}
                </h4>

                {reviewSubmitted && (
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                    Thank you! Your review has been added.
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Sam R."
                      value={reviewAuthor}
                      onChange={(e) => setReviewAuthor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Rating</label>
                    <div className="flex gap-2 items-center pt-1">
                      {[1, 2, 3, 4, 5].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setReviewRating(val)}
                          className="p-1 cursor-pointer"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              val <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Your Feedback</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Tell other fitness seekers about the vibe, cleanliness, equipment, and staff..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  Post Review
                </button>
              </form>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs">
          <div className="text-slate-400">
            Official Owner Website:{' '}
            <a
              href={gym.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:underline font-semibold"
            >
              {gym.websiteUrl}
            </a>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
