import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  Clock, 
  Dumbbell, 
  Sparkles, 
  Check, 
  Image as ImageIcon, 
  HelpCircle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Gym, GymVibe } from '../types/gym';
import { registerGym } from '../services/gymStorage';

interface GymRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGymRegistered: (newGym: Gym) => void;
}

export const GymRegistrationModal: React.FC<GymRegistrationModalProps> = ({
  isOpen,
  onClose,
  onGymRegistered,
}) => {
  const [activeTab, setActiveTab] = useState<'basics' | 'facilities' | 'media_faqs'>('basics');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('TX');
  const [zipCode, setZipCode] = useState('');

  const [monthlyPrice, setMonthlyPrice] = useState<number>(60);
  const [dayPassPrice, setDayPassPrice] = useState<number>(20);
  const [is24Hours, setIs24Hours] = useState(false);
  const [weekdaysHours, setWeekdaysHours] = useState('5:00 AM - 10:00 PM');
  const [saturdayHours, setSaturdayHours] = useState('7:00 AM - 8:00 PM');
  const [sundayHours, setSundayHours] = useState('8:00 AM - 6:00 PM');

  const [primaryVibe, setPrimaryVibe] = useState<GymVibe>('commercial_allaround');
  const [fitnessGoals, setFitnessGoals] = useState<string[]>(['muscle_strength', 'fat_loss', 'general_fitness']);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    '24/7 Keycard Access',
    'Olympic Weightlifting Platforms',
    'Sauna & Steam Room',
    'Locker Rooms',
    'Free Parking'
  ]);
  const [equipmentBrands, setEquipmentBrands] = useState<string>('Hammer Strength, Rogue, Life Fitness');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80');
  const [description, setDescription] = useState('');

  // Initial FAQ
  const [faqQuestion, setFaqQuestion] = useState('Do you offer a free day pass or trial for new visitors?');
  const [faqAnswer, setFaqAnswer] = useState('Yes! You can request a pass through our website or stop by the front desk for a complimentary day session.');

  if (!isOpen) return null;

  const presetPhotos = [
    {
      label: 'Heavy Iron & Powerlifting',
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    },
    {
      label: 'Luxury Spa & Club',
      url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    },
    {
      label: 'Cardio & Commercial Line',
      url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1200&q=80',
    },
    {
      label: 'CrossFit & Functional Rig',
      url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
    },
    {
      label: 'Yoga & Mindful Movement',
      url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const availableAmenities = [
    '24/7 Keycard Access',
    'Olympic Weightlifting Platforms',
    'Chalk Permitted',
    'Dumbbells up to 150+ lbs',
    'Sauna & Steam Room',
    'Cold Plunge Pools',
    'Swimming Pool',
    'Reformer Pilates Studio',
    'Yoga Studio',
    'Cardio Cinema / Zone',
    'Group Fitness Classes',
    'Personal Trainers On Staff',
    'Women-Only Training Area',
    'Smoothie & Protein Bar',
    'Locker Rooms & Showers',
    'Free Dedicated Parking',
    'Childcare Services',
  ];

  const toggleAmenity = (item: string) => {
    if (selectedAmenities.includes(item)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== item));
    } else {
      setSelectedAmenities([...selectedAmenities, item]);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please provide your Gym Name.');
      setActiveTab('basics');
      return;
    }
    if (!websiteUrl.trim()) {
      setErrorMsg('Please provide your official Gym Website URL.');
      setActiveTab('basics');
      return;
    }
    if (!ownerEmail.trim()) {
      setErrorMsg('Please enter a valid owner contact email.');
      setActiveTab('basics');
      return;
    }
    if (!city.trim() || !address.trim()) {
      setErrorMsg('Please provide the physical address and city.');
      setActiveTab('basics');
      return;
    }

    const brandsArray = equipmentBrands
      .split(',')
      .map(b => b.trim())
      .filter(Boolean);

    const initialFaqs = faqQuestion.trim() && faqAnswer.trim() ? [
      {
        id: `faq-${Date.now()}-owner`,
        question: faqQuestion.trim(),
        answer: faqAnswer.trim(),
        answeredByOwner: true,
        dateAdded: new Date().toISOString().split('T')[0],
      }
    ] : [];

    const newGym = registerGym({
      name,
      tagline: tagline.trim() || 'Premier fitness sanctuary built for performance.',
      websiteUrl,
      ownerName: ownerName.trim() || 'Gym Owner',
      ownerEmail,
      phone: phone.trim() || '(555) 123-4567',
      address,
      city,
      state,
      zipCode,
      monthlyPrice: Number(monthlyPrice) || 50,
      dayPassPrice: Number(dayPassPrice) || 20,
      is24Hours,
      openingHours: {
        weekdays: is24Hours ? 'Open 24/7' : weekdaysHours,
        saturday: is24Hours ? 'Open 24/7' : saturdayHours,
        sunday: is24Hours ? 'Open 24/7' : sundayHours,
      },
      primaryVibe,
      fitnessGoals,
      amenities: selectedAmenities,
      equipmentBrands: brandsArray.length > 0 ? brandsArray : ['Hammer Strength', 'Rogue'],
      coverImage,
      description: description.trim() || `Welcome to ${name}! We are dedicated to providing prime fitness facilities, expert guidance, and an inspiring workout environment. Visit our official website to learn more.`,
      faqs: initialFaqs,
    });

    onGymRegistered(newGym);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0f1523] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white font-['Syne']">
                  Register Your Gym & Website
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                  Owner Portal
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Showcase your facility, link your official website, and answer seeker questions
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/30 px-6">
          <button
            type="button"
            onClick={() => setActiveTab('basics')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'basics'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>1. Website & General Info</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('facilities')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'facilities'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>2. Hours, Pricing & Amenities</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('media_faqs')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'media_faqs'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>3. Photos & Owner Q&A</span>
          </button>
        </div>

        {/* Form Error Banner */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="font-bold underline ml-2">Dismiss</button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleRegister}>
          <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6">
            
            {/* TAB 1: Basics & Website */}
            {activeTab === 'basics' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Gym Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Iron Citadel Fitness"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-emerald-400" />
                        Official Website URL *
                      </span>
                      {websiteUrl && (
                        <a 
                          href={websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[11px] text-emerald-400 hover:underline flex items-center gap-0.5 normal-case font-normal"
                        >
                          Test Link <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. https://ironcitadelfit.com"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Tagline / One-Line Hook
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Austin's premier 24/7 powerlifting and bodybuilding facility."
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Owner / Manager Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Mercer"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Contact Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="owner@mygym.com"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="(555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    Physical Location
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Street Address *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 500 E 6th Street"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">City *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Austin"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">State / Zip</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          maxLength={2}
                          placeholder="TX"
                          value={state}
                          onChange={(e) => setState(e.target.value.toUpperCase())}
                          className="w-14 px-2 py-2 text-center rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-400 uppercase"
                        />
                        <input
                          type="text"
                          placeholder="78701"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Facilities, Hours & Pricing */}
            {activeTab === 'facilities' && (
              <div className="space-y-5">
                
                {/* Pricing & 24/7 */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    Membership & Passes
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Monthly Rate ($)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                        <input
                          type="number"
                          min="1"
                          value={monthlyPrice}
                          onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                          className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Day Pass / Trial ($)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                        <input
                          type="number"
                          min="0"
                          value={dayPassPrice}
                          onChange={(e) => setDayPassPrice(Number(e.target.value))}
                          className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col justify-end">
                      <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={is24Hours}
                          onChange={(e) => setIs24Hours(e.target.checked)}
                          className="rounded text-emerald-500 focus:ring-emerald-400 h-4 w-4"
                        />
                        <span className="text-xs font-bold text-white">24/7 Access Available</span>
                      </label>
                    </div>
                  </div>

                  {!is24Hours && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-800">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Weekdays Hours</label>
                        <input
                          type="text"
                          value={weekdaysHours}
                          onChange={(e) => setWeekdaysHours(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Saturday Hours</label>
                        <input
                          type="text"
                          value={saturdayHours}
                          onChange={(e) => setSaturdayHours(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Sunday Hours</label>
                        <input
                          type="text"
                          value={sundayHours}
                          onChange={(e) => setSundayHours(e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Vibe */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Primary Gym Vibe & Atmosphere
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'hardcore_iron', label: 'Hardcore Iron & Heavy Barbell' },
                      { id: 'boutique_luxury', label: 'Boutique Luxury & Wellness' },
                      { id: 'commercial_allaround', label: 'Commercial All-Rounder' },
                      { id: 'crossfit_functional', label: 'CrossFit & Functional Box' },
                      { id: 'wellness_mindbody', label: 'Mind-Body, Yoga & Pilates' },
                      { id: 'powerlifting_strength', label: 'Powerlifting / Bodybuilding' },
                    ].map(v => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setPrimaryVibe(v.id as GymVibe)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all ${
                          primaryVibe === v.id
                            ? 'bg-emerald-400/15 border-emerald-400 text-white font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amenities Multi-Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Available Amenities & Facilities ({selectedAmenities.length} selected)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {availableAmenities.map(amenity => {
                      const isChecked = selectedAmenities.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => toggleAmenity(amenity)}
                          className={`p-2 rounded-xl border text-left flex items-center justify-between text-xs transition-colors ${
                            isChecked
                              ? 'bg-emerald-400/15 border-emerald-400 text-white font-semibold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span className="truncate pr-1">{amenity}</span>
                          {isChecked ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          ) : (
                            <span className="w-3 h-3 rounded-sm border border-slate-700 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Equipment Brands */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Featured Equipment Brands (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Eleiko, Rogue, Hammer Strength, Arsenal Strength"
                    value={equipmentBrands}
                    onChange={(e) => setEquipmentBrands(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>

              </div>
            )}

            {/* TAB 3: Photos & Owner Q&A */}
            {activeTab === 'media_faqs' && (
              <div className="space-y-5">
                
                {/* Cover Photo Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    Cover Photo Selection
                  </label>

                  {/* Preset photo thumbnails */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
                    {presetPhotos.map((preset, idx) => (
                      <div
                        key={idx}
                        onClick={() => setCoverImage(preset.url)}
                        className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 aspect-video transition-all ${
                          coverImage === preset.url
                            ? 'border-emerald-400 ring-2 ring-emerald-400/30'
                            : 'border-slate-700 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-black/75 text-[9px] text-white p-1 text-center truncate font-medium">
                          {preset.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Or paste a custom image URL:</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Facility Overview & Pitch
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell members about your facility, community, coaching team, and special rules..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  />
                </div>

                {/* Initial Direct Owner Q&A */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Owner Answer to Common Question
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400">
                    Proactively answer questions that fitness seekers frequently ask before signing up:
                  </p>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Common Question</label>
                    <input
                      type="text"
                      value={faqQuestion}
                      onChange={(e) => setFaqQuestion(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Your Direct Answer</label>
                    <textarea
                      rows={2}
                      value={faqAnswer}
                      onChange={(e) => setFaqAnswer(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Form Actions Footer */}
          <div className="p-5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Gym Owner Listing</span>
            </div>

            <div className="flex items-center gap-3">
              {activeTab === 'basics' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('facilities')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                >
                  Next: Facilities & Amenities →
                </button>
              )}
              {activeTab === 'facilities' && (
                <button
                  type="button"
                  onClick={() => setActiveTab('media_faqs')}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                >
                  Next: Photos & Q&A →
                </button>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-slate-950" />
                <span>Register & Publish Gym</span>
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
