export interface PricingTier {
  id: string;
  name: string;
  price: number;
  period: 'day' | 'month' | 'quarter' | 'year';
  description: string;
  popular?: boolean;
  features: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  askedBy?: string;
  answeredByOwner: boolean;
  dateAdded: string;
}

export interface Review {
  id: string;
  authorName: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  helpfulCount: number;
}

export interface Inquiry {
  id: string;
  gymId: string;
  gymName: string;
  seekerName: string;
  seekerEmail: string;
  seekerPhone?: string;
  interestType: 'day_pass' | 'membership' | 'tour' | 'general';
  preferredDate?: string;
  message: string;
  date: string;
  status: 'new' | 'contacted' | 'resolved';
}

export type GymVibe = 
  | 'hardcore_iron'
  | 'boutique_luxury'
  | 'commercial_allaround'
  | 'crossfit_functional'
  | 'wellness_mindbody'
  | 'powerlifting_strength';

export interface Gym {
  id: string;
  name: string;
  tagline: string;
  websiteUrl: string; // The gym's website registered by the owner
  ownerName: string;
  ownerEmail: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  monthlyPrice: number;
  dayPassPrice?: number;
  is24Hours: boolean;
  openingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  coverImage: string;
  galleryImages: string[];
  primaryVibe: GymVibe;
  fitnessGoals: string[];
  amenities: string[];
  equipmentBrands: string[];
  description: string;
  faqs: FAQ[];
  reviews: Review[];
  inquiries?: Inquiry[];
  verifiedOwner: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface QuizAnswers {
  primaryGoal: string; // 'muscle_strength' | 'fat_loss' | 'crossfit' | 'wellness' | 'powerlifting' | 'general_fitness'
  budgetRange: string; // 'budget' (<$40) | 'moderate' ($40-$80) | 'premium' ($80-$130) | 'luxury' ($130+)
  timeSchedule: string; // 'early_bird' | 'midday' | 'evening_peak' | 'night_24_7'
  mustHaveAmenities: string[]; // ['Sauna / Steam', 'Olympic Platforms', 'Pool', 'Personal Training', 'Ladies Only Section', etc.]
  preferredVibe: string; // 'hardcore_iron' | 'boutique_luxury' | 'crossfit_functional' | 'wellness_mindbody' | 'commercial_allaround'
  cityLocation?: string;
}

export interface MatchResult {
  gym: Gym;
  score: number; // 0 to 100 percentage
  matchReasons: string[];
  highlightMatches: {
    goalMatch: boolean;
    budgetMatch: boolean;
    amenitiesCount: number;
    vibeMatch: boolean;
    hoursMatch: boolean;
  };
}

export interface FilterState {
  searchQuery: string;
  city: string;
  maxPrice: number;
  vibe: string;
  amenities: string[];
  is24HoursOnly: boolean;
  sortBy: 'match' | 'rating' | 'price_low' | 'price_high' | 'reviews';
}
