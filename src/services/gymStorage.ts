import { Gym, QuizAnswers, MatchResult, FAQ, Review, Inquiry } from '../types/gym';
import { INITIAL_GYMS } from '../data/initialGyms';

const STORAGE_KEY = 'flexfinder_gyms_v1';
const INQUIRIES_KEY = 'flexfinder_inquiries_v1';

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach(cb => cb());
}

export function subscribeToGyms(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getStoredGyms(): Gym[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GYMS));
      return INITIAL_GYMS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GYMS));
      return INITIAL_GYMS;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading gyms from localStorage:', err);
    return INITIAL_GYMS;
  }
}

export function saveGymsList(gyms: Gym[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gyms));
    notifyListeners();
  } catch (err) {
    console.error('Error saving gyms to localStorage:', err);
  }
}

export function getGymById(id: string): Gym | undefined {
  const gyms = getStoredGyms();
  return gyms.find(g => g.id === id);
}

export function registerGym(gymData: Partial<Gym> & { name: string; websiteUrl: string; ownerEmail: string; address: string; city: string; state: string }): Gym {
  const gyms = getStoredGyms();
  const id = gymData.id || `gym-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  
  // Format website URL if missing protocol
  let formattedUrl = gymData.websiteUrl.trim();
  if (formattedUrl && !/^https?:\/\//i.test(formattedUrl)) {
    formattedUrl = `https://${formattedUrl}`;
  }

  const existingIndex = gyms.findIndex(g => g.id === id);

  const newGym: Gym = {
    id,
    name: gymData.name.trim(),
    tagline: gymData.tagline?.trim() || 'Premier fitness facility equipped for all goals.',
    websiteUrl: formattedUrl,
    ownerName: gymData.ownerName?.trim() || 'Gym Owner',
    ownerEmail: gymData.ownerEmail.trim(),
    phone: gymData.phone?.trim() || '(555) 000-0000',
    address: gymData.address.trim(),
    city: gymData.city.trim(),
    state: gymData.state.trim().toUpperCase(),
    zipCode: gymData.zipCode?.trim() || '00000',
    monthlyPrice: Number(gymData.monthlyPrice) || 50,
    dayPassPrice: Number(gymData.dayPassPrice) || 15,
    is24Hours: Boolean(gymData.is24Hours),
    openingHours: gymData.openingHours || {
      weekdays: gymData.is24Hours ? 'Open 24/7' : '6:00 AM - 10:00 PM',
      saturday: gymData.is24Hours ? 'Open 24/7' : '7:00 AM - 8:00 PM',
      sunday: gymData.is24Hours ? 'Open 24/7' : '8:00 AM - 6:00 PM',
    },
    coverImage: gymData.coverImage?.trim() || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80',
    galleryImages: gymData.galleryImages?.length ? gymData.galleryImages : [
      'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    ],
    primaryVibe: gymData.primaryVibe || 'commercial_allaround',
    fitnessGoals: gymData.fitnessGoals && gymData.fitnessGoals.length > 0 ? gymData.fitnessGoals : ['muscle_strength', 'general_fitness'],
    amenities: gymData.amenities && gymData.amenities.length > 0 ? gymData.amenities : ['Free Weights', 'Locker Rooms', 'Cardio Equipment'],
    equipmentBrands: gymData.equipmentBrands && gymData.equipmentBrands.length > 0 ? gymData.equipmentBrands : ['Hammer Strength', 'Life Fitness'],
    description: gymData.description?.trim() || 'Welcome to our gym! We offer state of the art equipment and supportive trainers.',
    faqs: gymData.faqs || [
      {
        id: `faq-${Date.now()}-1`,
        question: 'Do you offer a free day pass trial?',
        answer: 'Yes! Send us an inquiry or visit our website to claim your complimentary pass.',
        answeredByOwner: true,
        dateAdded: new Date().toISOString().split('T')[0],
      }
    ],
    reviews: gymData.reviews || [],
    verifiedOwner: true,
    rating: existingIndex >= 0 ? gyms[existingIndex].rating : 5.0,
    reviewCount: existingIndex >= 0 ? gyms[existingIndex].reviewCount : 1,
    createdAt: existingIndex >= 0 ? gyms[existingIndex].createdAt : new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    gyms[existingIndex] = newGym;
  } else {
    gyms.unshift(newGym);
  }

  saveGymsList(gyms);
  return newGym;
}

export function deleteGym(gymId: string): boolean {
  const gyms = getStoredGyms();
  const filtered = gyms.filter(g => g.id !== gymId);
  if (filtered.length !== gyms.length) {
    saveGymsList(filtered);
    return true;
  }
  return false;
}

export function addFAQ(gymId: string, question: string, answer: string, askedBy?: string, answeredByOwner = false): FAQ | null {
  const gyms = getStoredGyms();
  const gymIndex = gyms.findIndex(g => g.id === gymId);
  if (gymIndex === -1) return null;

  const newFaq: FAQ = {
    id: `faq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    question: question.trim(),
    answer: answer.trim(),
    askedBy: askedBy?.trim() || 'Fitness Seeker',
    answeredByOwner,
    dateAdded: new Date().toISOString().split('T')[0],
  };

  gyms[gymIndex].faqs.unshift(newFaq);
  saveGymsList(gyms);
  return newFaq;
}

export function answerFAQ(gymId: string, faqId: string, answerText: string): boolean {
  const gyms = getStoredGyms();
  const gymIndex = gyms.findIndex(g => g.id === gymId);
  if (gymIndex === -1) return false;

  const faqIndex = gyms[gymIndex].faqs.findIndex(f => f.id === faqId);
  if (faqIndex === -1) return false;

  gyms[gymIndex].faqs[faqIndex].answer = answerText.trim();
  gyms[gymIndex].faqs[faqIndex].answeredByOwner = true;
  saveGymsList(gyms);
  return true;
}

export function addReview(gymId: string, authorName: string, rating: number, comment: string): Review | null {
  const gyms = getStoredGyms();
  const gymIndex = gyms.findIndex(g => g.id === gymId);
  if (gymIndex === -1) return null;

  const newReview: Review = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    authorName: authorName.trim() || 'Fitness Enthusiast',
    rating: Math.min(5, Math.max(1, rating)),
    comment: comment.trim(),
    date: new Date().toISOString().split('T')[0],
    helpfulCount: 0,
  };

  gyms[gymIndex].reviews.unshift(newReview);
  
  // Recalculate average rating
  const total = gyms[gymIndex].reviews.reduce((sum, r) => sum + r.rating, 0);
  gyms[gymIndex].reviewCount = gyms[gymIndex].reviews.length;
  gyms[gymIndex].rating = Number((total / gyms[gymIndex].reviewCount).toFixed(2));

  saveGymsList(gyms);
  return newReview;
}

// Inquiries / Leads stored for owners
export function getAllInquiries(): Inquiry[] {
  try {
    const raw = localStorage.getItem(INQUIRIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function submitInquiry(inquiry: Omit<Inquiry, 'id' | 'date' | 'status'>): Inquiry {
  const all = getAllInquiries();
  const newInq: Inquiry = {
    ...inquiry,
    id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    date: new Date().toISOString(),
    status: 'new',
  };
  all.unshift(newInq);
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(all));
  notifyListeners();
  return newInq;
}

export function updateInquiryStatus(inquiryId: string, status: Inquiry['status']): boolean {
  const all = getAllInquiries();
  const item = all.find(i => i.id === inquiryId);
  if (item) {
    item.status = status;
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(all));
    notifyListeners();
    return true;
  }
  return false;
}

export function resetToDefaultGyms(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_GYMS));
  notifyListeners();
}

/**
 * Intelligent Match Algorithm:
 * Evaluates the user's answers against each gym's features, pricing, schedule, and vibe.
 */
export function calculateGymMatch(gym: Gym, answers: QuizAnswers): MatchResult {
  let score = 30; // base score
  const matchReasons: string[] = [];

  let goalMatch = false;
  let budgetMatch = false;
  let vibeMatch = false;
  let hoursMatch = false;
  let matchedAmenitiesCount = 0;

  // 1. Primary Goal match (weight: 25%)
  if (answers.primaryGoal) {
    if (gym.fitnessGoals.includes(answers.primaryGoal)) {
      score += 25;
      goalMatch = true;
      const goalLabels: Record<string, string> = {
        muscle_strength: 'Muscle building & heavy lifting focus',
        fat_loss: 'Cardio & conditioning target',
        crossfit: 'Functional training & athletic performance',
        wellness: 'Mind-body balance & low impact recovery',
        powerlifting: 'Powerlifting & competitive barbell training',
        bodybuilding: 'Specialized hypertrophy & physique equipment',
        general_fitness: 'Comprehensive all-around fitness routines',
      };
      matchReasons.push(goalLabels[answers.primaryGoal] || 'Directly aligns with your fitness objective');
    }
  }

  // 2. Budget match (weight: 20%)
  if (answers.budgetRange) {
    let budgetCap = 200;
    if (answers.budgetRange === 'budget') budgetCap = 40;
    else if (answers.budgetRange === 'moderate') budgetCap = 80;
    else if (answers.budgetRange === 'premium') budgetCap = 130;
    else if (answers.budgetRange === 'luxury') budgetCap = 999;

    if (gym.monthlyPrice <= budgetCap) {
      score += 20;
      budgetMatch = true;
      matchReasons.push(`Great value at $${gym.monthlyPrice}/mo (within your budget target)`);
    } else if (gym.monthlyPrice <= budgetCap * 1.25) {
      score += 10;
      matchReasons.push(`Close to your budget at $${gym.monthlyPrice}/mo`);
    }
  }

  // 3. Schedule & Hours match (weight: 15%)
  if (answers.timeSchedule) {
    if (answers.timeSchedule === 'night_24_7') {
      if (gym.is24Hours) {
        score += 15;
        hoursMatch = true;
        matchReasons.push('Offers full 24/7 keycard access for any schedule');
      } else {
        score -= 10;
      }
    } else if (answers.timeSchedule === 'early_bird') {
      const openHours = gym.openingHours.weekdays.toLowerCase();
      if (gym.is24Hours || openHours.includes('5:') || openHours.includes('6:')) {
        score += 15;
        hoursMatch = true;
        matchReasons.push('Early dawn opening accommodates your 5am–7am workout window');
      }
    } else {
      score += 10;
      hoursMatch = true;
    }
  }

  // 4. Must-have Amenities match (weight: 20%)
  if (answers.mustHaveAmenities && answers.mustHaveAmenities.length > 0) {
    answers.mustHaveAmenities.forEach(req => {
      const normalizedReq = req.toLowerCase();
      const hasAmenity = gym.amenities.some(a => a.toLowerCase().includes(normalizedReq) || normalizedReq.includes(a.toLowerCase()));
      if (hasAmenity) {
        matchedAmenitiesCount++;
        score += Math.round(20 / answers.mustHaveAmenities.length);
      }
    });

    if (matchedAmenitiesCount > 0) {
      matchReasons.push(`Equipped with ${matchedAmenitiesCount} of your requested priority amenities`);
    }
  } else {
    score += 15;
  }

  // 5. Preferred Vibe match (weight: 15%)
  if (answers.preferredVibe) {
    if (gym.primaryVibe === answers.preferredVibe) {
      score += 15;
      vibeMatch = true;
      const vibeLabels: Record<string, string> = {
        hardcore_iron: 'Authentic heavy iron & hardcore lifting culture',
        boutique_luxury: 'Premium spa-like aesthetic & immaculate recovery zones',
        commercial_allaround: 'Spacious, versatile, and well-balanced atmosphere',
        crossfit_functional: 'Energetic team spirit and coach-led workouts',
        wellness_mindbody: 'Calm, focused, and rejuvenating sanctuary',
        powerlifting_strength: 'Powerlifting platforms, chalk & competition equipment',
      };
      matchReasons.push(vibeLabels[answers.preferredVibe] || 'Matches your preferred environment');
    } else {
      score += 5;
    }
  }

  // 6. City / Location match
  if (answers.cityLocation && answers.cityLocation.trim() !== '') {
    const searchCity = answers.cityLocation.trim().toLowerCase();
    if (gym.city.toLowerCase().includes(searchCity) || searchCity.includes(gym.city.toLowerCase())) {
      score += 5;
      matchReasons.push(`Located right in ${gym.city}`);
    }
  }

  const finalScore = Math.min(99, Math.max(35, score));

  return {
    gym,
    score: finalScore,
    matchReasons: matchReasons.slice(0, 4),
    highlightMatches: {
      goalMatch,
      budgetMatch,
      amenitiesCount: matchedAmenitiesCount,
      vibeMatch,
      hoursMatch,
    },
  };
}
